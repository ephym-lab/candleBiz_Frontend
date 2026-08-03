"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Loader2, AlertCircle, Search, X, MoreHorizontal, LayoutGrid, List as ListIcon, Filter, ChevronRight, Settings2, Upload } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import type { Product, UpdateProductRequest } from "@/lib/api/types"
import { getProducts, createProduct, updateProduct, deleteProduct, updateStock, searchProducts } from "@/lib/api/services/products"
import { useSearchParams } from "next/navigation"

const scents = ["lavender", "vanilla", "citrus", "eucalyptus", "rose", "sandalwood", "jasmine", "cinnamon"]
const sizes = ["small", "medium", "large"]

export default function AdminProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedScent, setSelectedScent] = useState("all")
  const [selectedSize, setSelectedSize] = useState("all")
  const [viewProduct, setViewProduct] = useState<Product | null>(null)
  
  // Sync state with URL if it changes (e.g. clicking a notification while on this page)
  useEffect(() => {
    const q = searchParams.get("q")
    if (q !== null) {
      setSearchQuery(q)
    }
  }, [searchParams])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state for new product
  const [formData, setFormData] = useState<UpdateProductRequest>({
    name: "",
    description: "",
    price: 0,
    scent: "",
    size: "",
    stock: 0,
    scent_description: "",
    burn_time: undefined,
    care_instructions: [],
    ingredients: [],
    related_products: [],
    bundle_offer: undefined,
  })

  // File state for image uploads
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([])
  const [mainImagePreview, setMainImagePreview] = useState<string>("")
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])


  // Fetch products
  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      let response

      if (searchQuery.trim()) {
        response = await searchProducts(searchQuery.trim())
      } else {
        response = await getProducts()
      }

      setProducts(response.products || [])
      setError(null)
    } catch (err) {
      console.error("Failed to fetch products:", err)
      setError("Failed to load products")
      toast.error("Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchProducts()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Handle create product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate main image file is provided
      if (!mainImageFile) {
        toast.error("Please select a main product image")
        setIsSubmitting(false)
        return
      }

      await createProduct(formData, mainImageFile, additionalImageFiles)
      toast.success("Product created successfully!")
      setIsDialogOpen(false)

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: 0,
        scent: "",
        size: "",
        stock: 0,
        scent_description: "",
        burn_time: undefined,
        care_instructions: [],
        ingredients: [],
        related_products: [],
        bundle_offer: undefined,
      })
      setMainImageFile(null)
      setAdditionalImageFiles([])
      setMainImagePreview("")
      setAdditionalImagePreviews([])

      fetchProducts()
    } catch (err) {
      console.error("Failed to create product:", err)
      toast.error(err instanceof Error ? err.message : "Failed to create product")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit product
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    setIsSubmitting(true)

    try {
      await updateProduct(selectedProduct.id, formData, mainImageFile || undefined, additionalImageFiles.length > 0 ? additionalImageFiles : undefined)
      toast.success("Product updated successfully!")
      setIsEditDialogOpen(false)
      setSelectedProduct(null)
      setMainImageFile(null)
      setAdditionalImageFiles([])
      setMainImagePreview("")
      setAdditionalImagePreviews([])
      fetchProducts()
    } catch (err) {
      console.error("Failed to update product:", err)
      toast.error(err instanceof Error ? err.message : "Failed to update product")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    setIsSubmitting(true)

    try {
      await deleteProduct(selectedProduct.id)
      toast.success("Product deleted successfully!")
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
      fetchProducts()
    } catch (err) {
      console.error("Failed to delete product:", err)
      toast.error("Failed to delete product")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle stock update
  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      await updateStock(productId, newStock)
      toast.success("Stock updated successfully!")
      fetchProducts()
    } catch (err) {
      console.error("Failed to update stock:", err)
      toast.error("Failed to update stock")
    }
  }

  // Handle main image file change
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle additional images file change
  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 2) {
      toast.error("Maximum 2 additional images allowed")
      return
    }

    setAdditionalImageFiles(files)

    // Create previews
    const previews: string[] = []
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        previews.push(reader.result as string)
        if (previews.length === files.length) {
          setAdditionalImagePreviews(previews)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // Remove additional image
  const removeAdditionalImage = (index: number) => {
    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index))
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Open edit dialog
  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      scent: product.scent,
      size: product.size,
      stock: product.stock,
      scent_description: product.scent_description,
      burn_time: product.burn_time,
      care_instructions: product.care_instructions || [],
      ingredients: product.ingredients || [],
      related_products: product.related_products || [],
      bundle_offer: product.bundle_offer || undefined,
    })

    // Reset file states but set existing images as previews
    setMainImageFile(null)
    setAdditionalImageFiles([])
    setMainImagePreview(product.image || "")
    setAdditionalImagePreviews(product.images || [])

    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  // Filter products based on tabs and secondary filters
  const filteredProducts = products.filter((product) => {
    if (activeTab === "in_stock" && product.stock === 0) return false
    if (activeTab === "low_stock" && (product.stock >= 10 || product.stock === 0)) return false
    if (activeTab === "out_of_stock" && product.stock > 0) return false
    
    if (selectedScent !== "all" && product.scent !== selectedScent) return false
    if (selectedSize !== "all" && product.size !== selectedSize) return false
    
    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchProducts}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Products</h1>
        </div>
        <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <SheetTrigger asChild>
            <Button className="bg-[#F26419] hover:bg-[#F26419]/90 text-white font-medium rounded-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-xl w-full flex flex-col p-0 border-l">
            <div className="px-6 py-5 border-b bg-muted/10">
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold">Add New Product</SheetTitle>
                <SheetDescription>Create a new candle product for your store</SheetDescription>
              </SheetHeader>
            </div>
            
            <form onSubmit={handleCreateProduct} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Basic Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input id="name" placeholder="e.g. Lavender Dreams" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="h-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (KES) *</Label>
                      <Input id="price" type="number" placeholder="1200" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} required className="h-10 rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea id="description" placeholder="Describe the candle..." rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required className="resize-none rounded-lg" />
                  </div>
                </div>

                {/* Categories & Inventory Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Categorization & Inventory</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="scent">Scent *</Label>
                      <Select value={formData.scent} onValueChange={(value) => setFormData({ ...formData, scent: value })}>
                        <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder="Select scent" /></SelectTrigger>
                        <SelectContent>{scents.map((scent) => (<SelectItem key={scent} value={scent}>{scent}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Size *</Label>
                      <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                        <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder="Select size" /></SelectTrigger>
                        <SelectContent>{sizes.map((size) => (<SelectItem key={size} value={size}>{size}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock *</Label>
                      <Input id="stock" type="number" placeholder="15" value={formData.stock || ""} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} required className="h-10 rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Media Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Product Media</h3>
                  
                  <div className="space-y-2">
                    <Label>Main Product Image *</Label>
                    <div className="relative border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-muted/5 hover:bg-muted/30 transition-colors cursor-pointer group">
                      <input id="image" type="file" accept="image/*" onChange={handleMainImageChange} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="p-3 bg-primary/10 rounded-full mb-3 text-primary group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6" />
                      </div>
                      <p className="font-medium text-sm">Click to browse or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP (max. 5MB)</p>
                    </div>
                    {mainImagePreview && (
                      <div className="relative w-24 h-24 mt-3 rounded-lg overflow-hidden border shadow-sm">
                        <Image src={mainImagePreview} alt="Main image preview" fill className="object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Images (Optional, max 2)</Label>
                    <div className="relative border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-muted/5 hover:bg-muted/30 transition-colors cursor-pointer group">
                      <input id="additional_images" type="file" accept="image/*" multiple onChange={handleAdditionalImagesChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="p-2 bg-muted rounded-full mb-2 text-muted-foreground group-hover:scale-110 transition-transform">
                        <Upload className="h-4 w-4" />
                      </div>
                      <p className="font-medium text-sm">Upload additional angles</p>
                    </div>
                    {additionalImagePreviews.length > 0 && (
                      <div className="flex gap-3 mt-3">
                        {additionalImagePreviews.map((preview, index) => (
                          <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border shadow-sm group">
                            <Image src={preview} alt={`Additional image ${index + 1}`} fill className="object-cover" />
                            <button type="button" onClick={() => removeAdditionalImage(index)} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Warning about image permanence */}
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">Choose images carefully</p>
                        <p className="text-amber-700/90 leading-relaxed">Images cannot be removed after creation, only replaced. Make sure to select the correct files before submitting.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional Details Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Optional Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="scent_description">Scent Description</Label>
                      <Textarea id="scent_description" placeholder="Describe the scent profile..." rows={2} value={formData.scent_description || ""} onChange={(e) => setFormData({ ...formData, scent_description: e.target.value })} className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="burn_time">Burn Time (hours)</Label>
                      <Input id="burn_time" type="number" placeholder="e.g. 40" value={formData.burn_time || ""} onChange={(e) => setFormData({ ...formData, burn_time: e.target.value ? Number(e.target.value) : undefined })} className="h-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="care_instructions">Care Instructions (comma-separated)</Label>
                      <Textarea id="care_instructions" placeholder="e.g. Keep away from drafts, Trim wick to 1/4 inch" rows={2} value={formData.care_instructions?.join(", ") || ""} onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value ? e.target.value.split(",").map(s => s.trim()) : [] })} className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                      <Textarea id="ingredients" placeholder="e.g. Soy wax, Essential oils, Cotton wick" rows={2} value={formData.ingredients?.join(", ") || ""} onChange={(e) => setFormData({ ...formData, ingredients: e.target.value ? e.target.value.split(",").map(s => s.trim()) : [] })} className="rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Bundle Offer Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Bundle Offer</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="bundle_quantity">Quantity</Label>
                      <Input id="bundle_quantity" type="number" placeholder="e.g. 2" value={formData.bundle_offer?.quantity || ""} onChange={(e) => setFormData({ ...formData, bundle_offer: e.target.value ? { quantity: Number(e.target.value), discount: formData.bundle_offer?.discount || 0, description: formData.bundle_offer?.description || "" } : undefined })} className="h-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bundle_discount">Discount (%)</Label>
                      <Input id="bundle_discount" type="number" placeholder="e.g. 10" value={formData.bundle_offer?.discount || ""} onChange={(e) => setFormData({ ...formData, bundle_offer: formData.bundle_offer ? { ...formData.bundle_offer, discount: Number(e.target.value) } : undefined })} className="h-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bundle_description">Description</Label>
                      <Input id="bundle_description" placeholder="e.g. Buy 2, get 10% off" value={formData.bundle_offer?.description || ""} onChange={(e) => setFormData({ ...formData, bundle_offer: formData.bundle_offer ? { ...formData.bundle_offer, description: e.target.value } : undefined })} className="h-10 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t bg-muted/10 flex justify-end gap-3 shrink-0">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting} className="rounded-lg px-6">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="rounded-lg px-6 bg-[#F26419] hover:bg-[#F26419]/90 text-white">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create Product
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Tabs and Secondary Filters */}
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-muted/50 p-1 rounded-lg h-auto gap-1">
              <TabsTrigger value="all" className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground">
                All
              </TabsTrigger>
              <TabsTrigger value="in_stock" className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground">
                In Stock
              </TabsTrigger>
              <TabsTrigger value="low_stock" className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground">
                Low Stock
              </TabsTrigger>
              <TabsTrigger value="out_of_stock" className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground">
                Out of Stock
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Filters Row */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-lg shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Select value={selectedScent} onValueChange={setSelectedScent}>
            <SelectTrigger className="h-10 w-[150px] rounded-lg shadow-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scents</SelectItem>
              {scents.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger className="h-10 w-[130px] rounded-lg shadow-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              {sizes.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden border border-muted/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
            <CardContent className="p-0 flex flex-col h-full">
              {/* Card Header Area */}
              <div className="p-4 flex items-start gap-4">
                <div className="relative h-14 w-14 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-muted/30">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-[15px] leading-tight truncate text-foreground">{product.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-muted-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(product)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(product)} className="text-destructive focus:bg-destructive/10">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] text-muted-foreground">SKU {product.id.substring(0, 8).toUpperCase()}</span>
                    {product.stock > 0 ? (
                      <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-green-50 text-green-700 border-green-200 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-red-50 text-red-700 border-red-200 font-medium">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Badges Area */}
              <div className="px-4 pb-4">
                <div className="flex gap-1.5 flex-wrap">
                  <Badge variant="secondary" className="h-6 rounded-md px-2 text-[11px] font-medium bg-muted/50 hover:bg-muted text-muted-foreground border-transparent capitalize">
                    {product.scent}
                  </Badge>
                  <Badge variant="secondary" className="h-6 rounded-md px-2 text-[11px] font-medium bg-muted/50 hover:bg-muted text-muted-foreground border-transparent capitalize">
                    {product.size}
                  </Badge>
                  <Badge variant="outline" className="h-6 rounded-md px-2 text-[11px] font-medium text-muted-foreground border-dashed">
                    Candle
                  </Badge>
                </div>
              </div>

              {/* Pricing Area */}
              <div className="px-4 pb-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">Retail</p>
                  <p className="font-semibold text-[15px]">KES {product.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">Wholesale</p>
                  <p className="font-semibold text-[15px]">
                    KES {product.bundle_offer?.discount 
                      ? Math.round(product.price * (1 - product.bundle_offer.discount / 100)).toLocaleString() 
                      : Math.round(product.price * 0.85).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-auto border-t border-muted/40 p-4 bg-muted/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[12px] font-medium ${product.stock < 10 ? 'text-red-600' : 'text-foreground'}`}>
                          {product.stock} stock
                        </span>
                        <span className="text-muted-foreground text-[12px]">&middot;</span>
                        <span className="text-[12px] text-muted-foreground">
                          {product.stock === 0 ? "Empty" : product.stock < 10 ? "Low" : "High"}
                        </span>
                      </div>
                      <div className="h-1 w-20 rounded-full bg-muted overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${product.stock === 0 ? 'bg-transparent' : product.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {product.stock === 0 ? (
                    <Button size="sm" className="h-7 text-[11px] px-3 bg-[#111] hover:bg-black text-white rounded-md">
                      Reorder
                    </Button>
                  ) : (
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-md border-muted/60" onClick={() => setViewProduct(product)}>
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6 rounded-xl border border-dashed bg-muted/10">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <p className="text-base font-medium">No products found</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Try adjusting your filters or create a new product to get started.
          </p>
        </div>
      )}

      {/* Edit Sheet */}
      <Sheet open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <SheetContent className="sm:max-w-xl w-full flex flex-col p-0 border-l">
            <div className="px-6 py-5 border-b bg-muted/10">
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold">Edit Product</SheetTitle>
                <SheetDescription>Update product details</SheetDescription>
              </SheetHeader>
            </div>
            
            <form onSubmit={handleEditProduct} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Basic Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Product Name *</Label>
                      <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="h-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-price">Price (KES) *</Label>
                      <Input id="edit-price" type="number" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} required className="h-10 rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description *</Label>
                    <Textarea id="edit-description" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required className="resize-none rounded-lg" />
                  </div>
                </div>

                {/* Categories & Inventory Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Categorization & Inventory</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Scent *</Label>
                      <Select value={formData.scent} onValueChange={(value) => setFormData({ ...formData, scent: value })}>
                        <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                        <SelectContent>{scents.map((scent) => (<SelectItem key={scent} value={scent}>{scent}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Size *</Label>
                      <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                        <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                        <SelectContent>{sizes.map((size) => (<SelectItem key={size} value={size}>{size}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-stock">Stock *</Label>
                      <Input id="edit-stock" type="number" value={formData.stock || ""} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} required className="h-10 rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Media Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Product Media</h3>
                  
                  <div className="space-y-2">
                    <Label>Main Product Image</Label>
                    <div className="relative border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-muted/5 hover:bg-muted/30 transition-colors cursor-pointer group">
                      <input id="edit-image" type="file" accept="image/*" onChange={handleMainImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="p-3 bg-primary/10 rounded-full mb-3 text-primary group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6" />
                      </div>
                      <p className="font-medium text-sm">Click to browse or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">Leave empty to keep existing image</p>
                    </div>
                    {mainImagePreview && (
                      <div className="relative w-24 h-24 mt-3 rounded-lg overflow-hidden border shadow-sm">
                        <Image src={mainImagePreview} alt="Main image preview" fill className="object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Images (Optional, max 2)</Label>
                    <div className="relative border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-muted/5 hover:bg-muted/30 transition-colors cursor-pointer group">
                      <input id="edit-additional_images" type="file" accept="image/*" multiple onChange={handleAdditionalImagesChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="p-2 bg-muted rounded-full mb-2 text-muted-foreground group-hover:scale-110 transition-transform">
                        <Upload className="h-4 w-4" />
                      </div>
                      <p className="font-medium text-sm">Upload new images</p>
                      <p className="text-xs text-muted-foreground mt-1">Leave empty to keep existing images</p>
                    </div>
                    {additionalImagePreviews.length > 0 && (
                      <div className="flex gap-3 mt-3">
                        {additionalImagePreviews.map((preview, index) => (
                          <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border shadow-sm">
                            <Image src={preview} alt={`Additional image ${index + 1}`} fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Optional Details Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Optional Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-scent_description">Scent Description</Label>
                      <Textarea id="edit-scent_description" placeholder="Describe the scent profile..." rows={2} value={formData.scent_description || ""} onChange={(e) => setFormData({ ...formData, scent_description: e.target.value })} className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-burn_time">Burn Time (hours)</Label>
                      <Input id="edit-burn_time" type="number" placeholder="e.g. 40" value={formData.burn_time || ""} onChange={(e) => setFormData({ ...formData, burn_time: e.target.value ? Number(e.target.value) : undefined })} className="h-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-care_instructions">Care Instructions (comma-separated)</Label>
                      <Textarea id="edit-care_instructions" placeholder="e.g. Keep away from drafts, Trim wick to 1/4 inch" rows={2} value={formData.care_instructions?.join(", ") || ""} onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value ? e.target.value.split(",").map(s => s.trim()) : [] })} className="rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-ingredients">Ingredients (comma-separated)</Label>
                      <Textarea id="edit-ingredients" placeholder="e.g. Soy wax, Essential oils, Cotton wick" rows={2} value={formData.ingredients?.join(", ") || ""} onChange={(e) => setFormData({ ...formData, ingredients: e.target.value ? e.target.value.split(",").map(s => s.trim()) : [] })} className="rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Bundle Offer Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Bundle Offer</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="edit-bundle_quantity">Quantity</Label>
                      <Input id="edit-bundle_quantity" type="number" placeholder="e.g. 2" value={formData.bundle_offer?.quantity || ""} onChange={(e) => setFormData({ ...formData, bundle_offer: e.target.value ? { quantity: Number(e.target.value), discount: formData.bundle_offer?.discount || 0, description: formData.bundle_offer?.description || "" } : undefined })} className="h-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-bundle_discount">Discount (%)</Label>
                      <Input id="edit-bundle_discount" type="number" placeholder="e.g. 10" value={formData.bundle_offer?.discount || ""} onChange={(e) => setFormData({ ...formData, bundle_offer: formData.bundle_offer ? { ...formData.bundle_offer, discount: Number(e.target.value) } : undefined })} className="h-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-bundle_description">Description</Label>
                      <Input id="edit-bundle_description" placeholder="e.g. Buy 2, get 10% off" value={formData.bundle_offer?.description || ""} onChange={(e) => setFormData({ ...formData, bundle_offer: formData.bundle_offer ? { ...formData.bundle_offer, description: e.target.value } : undefined })} className="h-10 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t bg-muted/10 flex justify-end gap-3 shrink-0">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting} className="rounded-lg px-6">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="rounded-lg px-6 bg-[#F26419] hover:bg-[#F26419]/90 text-white">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Update Product
                </Button>
              </div>
            </form>
          </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product "{selectedProduct?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} disabled={isSubmitting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Product Sheet */}
      <Sheet open={viewProduct !== null} onOpenChange={(open) => !open && setViewProduct(null)}>
        <SheetContent className="sm:max-w-md w-full flex flex-col p-0 border-l">
          {viewProduct && (
            <>
              <div className="px-6 py-5 border-b bg-muted/10 shrink-0">
                <SheetHeader>
                  <SheetTitle className="text-xl font-semibold">Product Details</SheetTitle>
                  <SheetDescription>View all information about this product.</SheetDescription>
                </SheetHeader>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Image Section */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-muted border">
                  <Image src={viewProduct.image || "/placeholder.svg"} alt={viewProduct.name} fill className="object-cover" />
                  <div className="absolute top-3 right-3">
                    <Badge variant={viewProduct.stock > 0 ? "secondary" : "destructive"} className="shadow-sm border-0">
                      {viewProduct.stock > 0 ? 'Active' : 'Out of Stock'}
                    </Badge>
                  </div>
                </div>

                {/* Main Details */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold">{viewProduct.name}</h2>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">SKU: {viewProduct.id.substring(0, 8)}...</p>
                  
                  <div className="flex items-center justify-between border-y py-4 mb-4 bg-muted/5 -mx-6 px-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 font-medium">Retail Price</p>
                      <p className="text-xl font-bold text-[#F26419]">KES {viewProduct.price.toLocaleString()}</p>
                    </div>
                    {viewProduct.bundle_offer && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1 font-medium">Wholesale (Bundle)</p>
                        <p className="text-xl font-bold text-[#F26419]">
                          KES {Math.round(viewProduct.price * (1 - viewProduct.bundle_offer.discount / 100)).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm leading-relaxed text-muted-foreground">{viewProduct.description}</p>
                </div>

                {/* Categorization & Inventory */}
                <div>
                  <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">Product Stats</h3>
                  <div className="grid grid-cols-2 gap-4 bg-muted/20 p-5 rounded-xl border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Category</p>
                      <p className="text-sm font-medium capitalize">{viewProduct.scent}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Type/Size</p>
                      <p className="text-sm font-medium capitalize">{viewProduct.size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Inventory</p>
                      <p className={`text-sm font-medium ${viewProduct.stock < 10 ? 'text-red-600' : 'text-foreground'}`}>
                        {viewProduct.stock} units
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Added</p>
                      <p className="text-sm font-medium">
                        {new Date(viewProduct.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Images (if any exist) */}
                {viewProduct.images && viewProduct.images.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Additional Images</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
                      {viewProduct.images.map((img: string, i: number) => (
                        <div key={i} className="relative h-28 w-28 rounded-lg overflow-hidden border flex-shrink-0 shadow-sm">
                          <Image src={img} alt={`${viewProduct.name} ${i+1}`} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
                
              {/* Action Buttons */}
              <div className="px-6 py-4 border-t bg-muted/10 flex gap-3 shrink-0">
                <Button className="flex-1 rounded-lg" variant="outline" onClick={() => { setViewProduct(null); openEditDialog(viewProduct); }}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button className="flex-1 rounded-lg text-destructive border-destructive hover:bg-destructive/10" variant="outline" onClick={() => { setViewProduct(null); openDeleteDialog(viewProduct); }}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

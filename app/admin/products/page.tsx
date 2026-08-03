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
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Loader2, AlertCircle, Search, X } from "lucide-react"
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your candle inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Create a new candle product for your store</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Lavender Dreams"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (KES) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="1200"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the candle..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="scent">Scent *</Label>
                  <Select value={formData.scent} onValueChange={(value) => setFormData({ ...formData, scent: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scent" />
                    </SelectTrigger>
                    <SelectContent>
                      {scents.map((scent) => (
                        <SelectItem key={scent} value={scent}>
                          {scent}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size *</Label>
                  <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="15"
                    value={formData.stock || ""}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Main Product Image *</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  required
                />
                {mainImagePreview && (
                  <div className="relative w-full h-48 mt-2 rounded-lg overflow-hidden bg-muted">
                    <Image src={mainImagePreview} alt="Main image preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_images">Additional Images (Optional, max 2)</Label>
                <Input
                  id="additional_images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                />
                {additionalImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {additionalImagePreviews.map((preview, index) => (
                      <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                        <Image src={preview} alt={`Additional image ${index + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Warning about image permanence */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Choose images carefully</p>
                    <p className="text-amber-700 mt-1">Images cannot be removed after creation, only replaced with new ones. Make sure to select the correct images before submitting.</p>
                  </div>
                </div>
              </div>

              {/* Optional Fields */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium mb-3">Optional Details</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="scent_description">Scent Description</Label>
                    <Textarea
                      id="scent_description"
                      placeholder="Describe the scent profile..."
                      rows={2}
                      value={formData.scent_description || ""}
                      onChange={(e) => setFormData({ ...formData, scent_description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="burn_time">Burn Time (hours)</Label>
                    <Input
                      id="burn_time"
                      type="number"
                      placeholder="e.g. 40"
                      value={formData.burn_time || ""}
                      onChange={(e) => setFormData({ ...formData, burn_time: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="care_instructions">Care Instructions (comma-separated)</Label>
                    <Textarea
                      id="care_instructions"
                      placeholder="e.g. Keep away from drafts, Trim wick to 1/4 inch"
                      rows={2}
                      value={formData.care_instructions?.join(", ") || ""}
                      onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value ? e.target.value.split(",").map(s => s.trim()) : [] })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                    <Textarea
                      id="ingredients"
                      placeholder="e.g. Soy wax, Essential oils, Cotton wick"
                      rows={2}
                      value={formData.ingredients?.join(", ") || ""}
                      onChange={(e) => setFormData({ ...formData, ingredients: e.target.value ? e.target.value.split(",").map(s => s.trim()) : [] })}
                    />
                  </div>
                </div>

                {/* Bundle Offer Section */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-medium mb-3">Bundle Offer (Optional)</h4>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="bundle_quantity">Quantity</Label>
                        <Input
                          id="bundle_quantity"
                          type="number"
                          placeholder="e.g. 2"
                          value={formData.bundle_offer?.quantity || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            bundle_offer: e.target.value ? {
                              quantity: Number(e.target.value),
                              discount: formData.bundle_offer?.discount || 0,
                              description: formData.bundle_offer?.description || ""
                            } : undefined
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bundle_discount">Discount (%)</Label>
                        <Input
                          id="bundle_discount"
                          type="number"
                          placeholder="e.g. 10"
                          value={formData.bundle_offer?.discount || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            bundle_offer: formData.bundle_offer ? {
                              ...formData.bundle_offer,
                              discount: Number(e.target.value)
                            } : undefined
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bundle_description">Description</Label>
                        <Input
                          id="bundle_description"
                          placeholder="e.g. Buy 2, get 10% off"
                          value={formData.bundle_offer?.description || ""}
                          onChange={(e) => setFormData({
                            ...formData,
                            bundle_offer: formData.bundle_offer ? {
                              ...formData.bundle_offer,
                              description: e.target.value
                            } : undefined
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
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

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-muted">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight">{product.name}</h3>
                  <Badge variant={product.stock < 10 ? "destructive" : "secondary"}>{product.stock} in stock</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-lg font-bold">KES {product.price.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openDeleteDialog(product)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Badge variant="outline">{product.scent}</Badge>
                  <Badge variant="outline">{product.size}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No products found. Create your first product!</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProduct} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (KES) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Scent *</Label>
                <Select value={formData.scent} onValueChange={(value) => setFormData({ ...formData, scent: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {scents.map((scent) => (
                      <SelectItem key={scent} value={scent}>
                        {scent}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Size *</Label>
                <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock *</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stock || ""}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Main Product Image</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
              />
              <p className="text-xs text-muted-foreground">Leave empty to keep existing image</p>
              {mainImagePreview && (
                <div className="relative w-full h-48 mt-2 rounded-lg overflow-hidden bg-muted">
                  <Image src={mainImagePreview} alt="Main image preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-additional_images">Additional Images (Optional, max 2)</Label>
              <Input
                id="edit-additional_images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
              />
              <p className="text-xs text-muted-foreground">Upload new images to replace existing ones</p>
              {additionalImagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {additionalImagePreviews.map((preview, index) => (
                    <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                      <Image src={preview} alt={`Additional image ${index + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Optional Fields */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium mb-3">Optional Details</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-scent_description">Scent Description</Label>
                  <Textarea
                    id="edit-scent_description"
                    placeholder="Describe the scent profile..."
                    rows={2}
                    value={formData.scent_description || ""}
                    onChange={(e) => setFormData({ ...formData, scent_description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-burn_time">Burn Time (hours)</Label>
                  <Input
                    id="edit-burn_time"
                    type="number"
                    placeholder="e.g. 40"
                    value={formData.burn_time || ""}
                    onChange={(e) => setFormData({ ...formData, burn_time: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-care_instructions">Care Instructions (comma-separated)</Label>
                  <Textarea
                    id="edit-care_instructions"
                    placeholder="e.g. Keep away from drafts, Trim wick to 1/4 inch"
                    rows={2}
                    value={formData.care_instructions?.join(", ") || ""}
                    onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value ? e.target.value.split(",").map(s => s.trim()) : [] })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-ingredients">Ingredients (comma-separated)</Label>
                  <Textarea
                    id="edit-ingredients"
                    placeholder="e.g. Soy wax, Essential oils, Cotton wick"
                    rows={2}
                    value={formData.ingredients?.join(", ") || ""}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value ? e.target.value.split(",").map(s => s.trim()) : [] })}
                  />
                </div>
              </div>
            </div>

            {/* Bundle Offer Section */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium mb-3">Bundle Offer (Optional)</h4>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-bundle_quantity">Quantity</Label>
                    <Input
                      id="edit-bundle_quantity"
                      type="number"
                      placeholder="e.g. 2"
                      value={formData.bundle_offer?.quantity || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        bundle_offer: e.target.value ? {
                          quantity: Number(e.target.value),
                          discount: formData.bundle_offer?.discount || 0,
                          description: formData.bundle_offer?.description || ""
                        } : undefined
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-bundle_discount">Discount (%)</Label>
                    <Input
                      id="edit-bundle_discount"
                      type="number"
                      placeholder="e.g. 10"
                      value={formData.bundle_offer?.discount || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        bundle_offer: formData.bundle_offer ? {
                          ...formData.bundle_offer,
                          discount: Number(e.target.value)
                        } : undefined
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-bundle_description">Description</Label>
                    <Input
                      id="edit-bundle_description"
                      placeholder="e.g. Buy 2, get 10% off"
                      value={formData.bundle_offer?.description || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        bundle_offer: formData.bundle_offer ? {
                          ...formData.bundle_offer,
                          description: e.target.value
                        } : undefined
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Update Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedProduct?.name}". This action cannot be undone.
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
    </div>
  )
}

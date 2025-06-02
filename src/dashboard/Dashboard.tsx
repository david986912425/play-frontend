import { useEffect, useState } from "react"
import axios from "axios"
import { Plus, Package, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { ProductRow } from "@/dashboard/components/ProductRow.tsx"
import { ProductDetails } from "@/dashboard/components/ProductDetails.tsx"
import { ProductForm } from "@/dashboard/components/ProductForm.tsx"
import { BACKEND_URL } from "@/utils/env.ts"

interface Product {
    _id: string
    name: string
    description: string
    image: string
    uuid: string
    createdAt: string
    updatedAt: string
    __v: number
}

interface ProductFormData {
    name: string
    description: string
    image: File | string | null
}

export default function ProductsDashboard() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null)
    const [editingProductUuid, setEditingProductUuid] = useState<string | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

    const [newProduct, setNewProduct] = useState<ProductFormData>({
        name: "",
        description: "",
        image: null,
    })

    const fetchProducts = async () => {
        try {
            setLoading(true)
            setError("")

            const response = await axios.get<Product[]>(`${BACKEND_URL}/products`)
            setProducts(response.data)
        } catch (err) {
            setError("Error al cargar productos")
            toast.error("Error al cargar productos")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.description) {
            toast.error("Por favor completa todos los campos requeridos")
            return
        }

        try {
            const formData = new FormData()
            formData.append("name", newProduct.name)
            formData.append("description", newProduct.description)

            // Solo agregar si image es File
            if (newProduct.image && newProduct.image instanceof File) {
                formData.append("image", newProduct.image)
            }

            await axios.post(`${BACKEND_URL}/products`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            await fetchProducts()

            setNewProduct({ name: "", description: "", image: null })
            setIsAddDialogOpen(false)
            toast.success("El producto se ha agregado exitosamente")
        } catch (error: any) {
            const msg = error.response?.data?.message || "Error al agregar el producto"
            toast.error(msg)
            console.error(error)
        }
    }

    const handleEditProduct = async () => {
        if (!editingProduct || !editingProductUuid) return

        if (!editingProduct.name || !editingProduct.description) {
            toast.error("Por favor completa todos los campos requeridos")
            return
        }

        try {
            const formData = new FormData()
            formData.append("name", editingProduct.name)
            formData.append("description", editingProduct.description)

            if (editingProduct.image && editingProduct.image instanceof File) {
                formData.append("image", editingProduct.image)
            }

            await axios.patch(`${BACKEND_URL}/products/${editingProductUuid}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            await fetchProducts()

            setEditingProduct(null)
            setEditingProductUuid(null)
            setIsEditDialogOpen(false)
            toast.success("El producto se ha actualizado exitosamente")
        } catch (error) {
            toast.error("Error al actualizar el producto")
            console.error(error)
        }
    }

    const handleDeleteProduct = async (productUuid: string) => {
        try {
            await axios.delete(`${BACKEND_URL}/products/${productUuid}`)
            toast.success("El producto se ha eliminado exitosamente")

            fetchProducts()
        } catch (error) {
            toast.error("Error al eliminar el producto")
            console.error(error)
        }
    }

    const handleViewProduct = (product: Product) => {
        setSelectedProduct(product)
        setIsDetailsDialogOpen(true)
    }

    const handleEditClick = (product: Product) => {
        setEditingProduct({
            name: product.name,
            description: product.description,
            image: product.image, // url string
        })
        setEditingProductUuid(product.uuid)
        setIsEditDialogOpen(true)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
                <p className="mt-2 text-gray-600">Administra tu inventario de productos</p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Lista de Productos</CardTitle>
                            <CardDescription>Gestiona todos tus productos desde aquí</CardDescription>
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Producto
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                                    <DialogDescription>
                                        Completa la información del nuevo producto
                                    </DialogDescription>
                                </DialogHeader>
                                <ProductForm
                                    data={newProduct}
                                    onChange={setNewProduct}
                                    onSubmit={handleAddProduct}
                                    onCancel={() => setIsAddDialogOpen(false)}
                                    submitLabel="Agregar Producto"
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>

                    {loading ? (
                        <div className="text-center py-8">Cargando productos...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">{error}</div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
                            <p className="text-gray-500">
                                {searchTerm
                                    ? "No se encontraron productos que coincidan con tu búsqueda."
                                    : "Comienza agregando tu primer producto."}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Imagen</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead className="hidden md:table-cell">Descripción</TableHead>
                                        <TableHead className="hidden sm:table-cell">Creado</TableHead>
                                        <TableHead className="hidden sm:table-cell">Actualizado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <ProductRow
                                            key={product.uuid}
                                            product={product}
                                            onView={handleViewProduct}
                                            onEdit={handleEditClick}
                                            onDelete={() => handleDeleteProduct(product.uuid)}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Detalles del Producto</DialogTitle>
                    </DialogHeader>
                    {selectedProduct && <ProductDetails productUuid={selectedProduct.uuid}/>}
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Producto</DialogTitle>
                        <DialogDescription>
                            Modifica la información del producto
                        </DialogDescription>
                    </DialogHeader>
                    {editingProduct && (
                        <ProductForm
                            data={editingProduct}
                            onChange={setEditingProduct}
                            onSubmit={handleEditProduct}
                            onCancel={() => setIsEditDialogOpen(false)}
                            submitLabel="Actualizar Producto"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

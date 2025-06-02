"use client"

import { Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

interface ProductActionsProps {
    product: Product
    onView: (product: Product) => void
    onEdit: (product: Product) => void
    onDelete: (productId: string) => void
}

export function ProductActions({ product, onView, onEdit, onDelete }: ProductActionsProps) {
    return (
        <div className="flex justify-end gap-2">
            {/* Ver detalles */}
            <Button variant="ghost" size="sm" onClick={() => onView(product)}>
                <Eye className="h-4 w-4" />
            </Button>

            {/* Editar */}
            <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                <Edit className="h-4 w-4" />
            </Button>

            {/* Eliminar */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El producto "{product.name}" será eliminado
                            permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => onDelete(product._id)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

import { TableCell, TableRow } from "@/components/ui/table"
import { ProductActions } from "./ProductActions"
import {BASE_MEDIA_URL} from "@/utils/env.ts";

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

interface ProductRowProps {
    product: Product
    onView: (product: Product) => void
    onEdit: (product: Product) => void
    onDelete: (productId: string) => void
}

export function ProductRow({ product, onView, onEdit, onDelete }: ProductRowProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <TableRow>
            <TableCell>
                <img
                    src={`${BASE_MEDIA_URL}${product.image}` || "/placeholder.svg"}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                />
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="hidden md:table-cell max-w-[200px]">
                <p className="truncate">{product.description}</p>
            </TableCell>
            <TableCell className="hidden sm:table-cell text-sm text-gray-500">
                {formatDate(product.createdAt)}
            </TableCell>
            <TableCell className="hidden sm:table-cell text-sm text-gray-500">
                {formatDate(product.updatedAt)}
            </TableCell>
            <TableCell className="text-right">
                <ProductActions
                    product={product}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </TableCell>
        </TableRow>
    )
}

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import {BACKEND_URL, BASE_MEDIA_URL} from "@/utils/env"

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

interface ProductDetailsProps {
  productUuid: string
}

export function ProductDetails({ productUuid }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (!productUuid) return

    fetch(`${BACKEND_URL}/products/${productUuid}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((err) => console.error("Error fetching product:", err))
  }, [productUuid])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!product) return <p>Cargando producto...</p>

  return (
      <div className="grid gap-4 py-4">
        <div className="flex justify-center">
          <img
              src={product.image ? `${BASE_MEDIA_URL}${product.image}` : "/placeholder.svg"}
              alt={product.name}
              width={200}
              height={200}
              className="rounded-lg object-cover"
          />
        </div>
        <div className="grid gap-2">
          <Label className="font-semibold">Nombre</Label>
          <p>{product.name}</p>
        </div>
        <div className="grid gap-2">
          <Label className="font-semibold">Descripción</Label>
          <p>{product.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-semibold">ID</Label>
            <p className="text-sm text-gray-500 break-all">{product._id}</p>
          </div>
          <div>
            <Label className="font-semibold">UUID</Label>
            <p className="text-sm text-gray-500 break-all">{product.uuid}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-semibold">Creado</Label>
            <p className="text-sm">{formatDate(product.createdAt)}</p>
          </div>
          <div>
            <Label className="font-semibold">Actualizado</Label>
            <p className="text-sm">{formatDate(product.updatedAt)}</p>
          </div>
        </div>
      </div>
  )
}

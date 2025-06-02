import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ProductFormData {
    name: string
    description: string
    image: File | null
}

interface ProductFormProps {
    data: ProductFormData
    onChange: (data: ProductFormData) => void
    onSubmit: () => void
    onCancel: () => void
    submitLabel: string
}

export function ProductForm({ data, onChange, onSubmit, onCancel, submitLabel }: ProductFormProps) {
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        onChange({ ...data, image: file })
    }

    return (
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => onChange({ ...data, name: e.target.value })}
                    placeholder="Nombre del producto"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => onChange({ ...data, description: e.target.value })}
                    placeholder="Descripción del producto"
                    rows={3}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="image">Imagen</Label>
                <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                />
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button onClick={onSubmit}>{submitLabel}</Button>
            </div>
        </div>
    )
}

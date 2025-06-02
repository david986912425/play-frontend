interface ReportDetail {
    uuid: string
    date: string
    product: string
    category: string
    quantity: number
    unit_price: string
    total_price: string
    region: string
    report_uuid: string
}

export interface Report {
    uuid: string
    file_url: string
    pdf_url: string
    uploaded_at: string
    total_sales: string
    top_products: Array<{
        product: string
        total: number
    }>
    sales_by_region: Record<string, number>
    sales_by_date: Record<string, number>
    insight: string
    details: ReportDetail[]
}
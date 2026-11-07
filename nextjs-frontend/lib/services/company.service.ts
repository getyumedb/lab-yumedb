import type { CompanyDetail } from "@/types"
import apiClient from "@/lib/api/client"
import endpoints from "@/lib/api/endpoints"

function isMock(): boolean {
  return process.env.NEXT_PUBLIC_DATA_SOURCE !== "api"
}

export async function getCompanies(): Promise<CompanyDetail[]> {
  if (isMock()) {
    const { getMockCompanies } = await import("@/lib/mock/company.mock")
    return getMockCompanies()
  }
  const { data } = await apiClient.get<CompanyDetail[]>(endpoints.companies)
  return data
}

export async function getCompanyById(id: string): Promise<CompanyDetail | null> {
  if (isMock()) {
    const { getMockCompany } = await import("@/lib/mock/company.mock")
    return getMockCompany(id)
  }
  const { data } = await apiClient.get<CompanyDetail>(endpoints.companyById(id))
  return data
}

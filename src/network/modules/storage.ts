import { Warehourse } from "@/types/warehourse";
import { request } from "../request";

export function SearchStorages(address: string) {
    return request<{ rows: Warehourse[], count: number}>({
        url: '/warehourse/storage',
        method: 'GET',
        params: {
            address
        }
    })
}

export function GetStorage(id: number) {
    return request<Warehourse | null>({
        url: `/warehourse/storage/${id}`,
        method: 'GET',
    })
}

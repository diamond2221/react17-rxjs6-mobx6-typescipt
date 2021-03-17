import { useState } from "react";

type ReturnState = ReturnType<(typeof useState)>

// export function GetLoadingHook(state: boolean = false): ReturnState {
//     const [tableLoading, setTableLoading] = useState(state)
//     return [tableLoading, setTableLoading]
// }

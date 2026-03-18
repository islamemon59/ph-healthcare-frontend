"use client"


import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import CreateScheduleFormModal from "./CreateScheduleFormModal"
import DeleteScheduleConfirmationDialog from "./DeleteScheduleConfirmationDialog"
import EditScheduleFormModal from "./EditScheduleFormModal"
import { schedulesColumns } from "./schedulesColumns"
import ViewScheduleDialog from "./ViewScheduleDialog"
import { ISchedule } from "@/src/types/schedule.types"
import { useRowActionModalState } from "@/src/hooks/useRowActionModalState"
import { useServerManagedDataTable } from "@/src/hooks/useServerManagedDataTable"
import { getSchedules } from "@/src/services/schedule.services"
import { useServerManagedDataTableSearch } from "@/src/hooks/useServerManagedDataTableSearch"
import { PaginationMeta } from "@/src/types/api.types"
import DataTable from "@/src/components/shared/table/DataTable"

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const SchedulesTable = ({ initialQueryString }: { initialQueryString: string }) => {
	const searchParams = useSearchParams()
	const {
		viewingItem,
		editingItem,
		deletingItem,
		isViewDialogOpen,
		isEditModalOpen,
		isDeleteDialogOpen,
		onViewOpenChange,
		onEditOpenChange,
		onDeleteOpenChange,
		tableActions,
	} = useRowActionModalState<ISchedule>()

	const {
		queryStringFromUrl,
		optimisticSortingState,
		optimisticPaginationState,
		isRouteRefreshPending,
		updateParams,
		handleSortingChange,
		handlePaginationChange,
	} = useServerManagedDataTable({
		searchParams,
		defaultPage: DEFAULT_PAGE,
		defaultLimit: DEFAULT_LIMIT,
	})

	const queryString = queryStringFromUrl || initialQueryString

	const {
		searchTermFromUrl,
		handleDebouncedSearchChange,
	} = useServerManagedDataTableSearch({
		searchParams,
		updateParams,
	})

	const { data: schedulesResponse, isLoading, isFetching } = useQuery({
		queryKey: ["schedules", queryString],
		queryFn: () => getSchedules(queryString),
	})

	const schedules = schedulesResponse?.data ?? []
	const meta: PaginationMeta | undefined = schedulesResponse?.meta

	return (
		<>
			<DataTable
				data={schedules}
				columns={schedulesColumns}
				isLoading={isLoading || isFetching || isRouteRefreshPending}
				emptyMessage="No schedules found."
				sorting={{
					state: optimisticSortingState,
					onSortingChange: handleSortingChange,
				}}
				pagination={{
					state: optimisticPaginationState,
					onPaginationChange: handlePaginationChange,
				}}
				search={{
					initialValue: searchTermFromUrl,
					placeholder: "Search schedule by id or datetime...",
					debounceMs: 700,
					onDebouncedChange: handleDebouncedSearchChange,
				}}
				toolbarAction={<CreateScheduleFormModal />}
				meta={meta}
				actions={tableActions}
			/>

			<EditScheduleFormModal
				open={isEditModalOpen}
				onOpenChange={onEditOpenChange}
				schedule={editingItem}
			/>

			<DeleteScheduleConfirmationDialog
				open={isDeleteDialogOpen}
				onOpenChange={onDeleteOpenChange}
				schedule={deletingItem}
			/>

			<ViewScheduleDialog
				open={isViewDialogOpen}
				onOpenChange={onViewOpenChange}
				schedule={viewingItem}
			/>
		</>
	)
}

export default SchedulesTable
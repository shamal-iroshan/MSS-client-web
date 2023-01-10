import { Edit, Trash2 } from "react-feather"
import {Badge} from "reactstrap"

export const workItemsTableHandler = () => {

    const handleTrackState = (qty, warning, crit) => {

        if (qty > warning) return <Badge color='light-success'>good</Badge>
        else if (qty <= warning && qty > crit) return <Badge color='light-warning'>warning</Badge>

        return <Badge color='light-danger'>critical</Badge>
    }

    return  [
        {
            name: 'NAME',
            sortable: true,
            minWidth: '100px',
            selector: row => {
                return row?.item_name
            }
        },
        {
            name: 'SERIAL NUMBER',
            sortable: true,
            minWidth: '100px',
            selector: row => {
                return row.serial_number
            }
        },
        {
            name: 'QUANTITY',
            sortable: true,
            minWidth: '100px',
            selector: row => {
                return `${row?.quantity}`
            }
        },
        {
            name: 'CRITICAL LEVEL',
            sortable: true,
            minWidth: '100px',
            selector: row => {
                return row.track_level
            }
        },
        {
            name: 'WARNING LEVEL',
            sortable: true,
            minWidth: '100px',
            selector: row => {
                return row.warning_level
            }
        },
        {
            name: 'ITEM STATUS',
            sortable: true,
            minWidth: '100px',
            selector: (row) => {
                return handleTrackState(parseInt(row?.quantity), parseInt(row.warning_level), parseInt(row.critical_level))
            }
        },
        {
            name: 'ACTIONS',
            sortable: true,
            minWidth: '100px',
            selector: () => {
                return <div>
                    <button
                        className='btn clickable'>
                        <Trash2  size={15} color='crimson'/>
                    </button>
                </div>
            }
        }
    ]
}

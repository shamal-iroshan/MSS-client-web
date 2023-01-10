import {Card, CardBody, CardFooter, CardHeader, Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap"
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis} from "recharts"
import {Activity, AlertTriangle, Check} from "react-feather"
import IncomeReportChart from "../../components/IncomerReportView/IncomeReportChart"
import {useDispatch, useSelector} from "react-redux"
import {useEffect, useState} from "react"
import {
    dashboardActions,
    selectDashboardCriticalInventory,
    selectDashboardGoodInventory,
    selectDashboardWarningInventory
} from "./slice/dashboardSlice"
import {incomeActions, selectIncomeMonth, selectIncomeStats} from "../IncomeReportView/slice/incomeReportSlice"
import InventorManagementTable from "../InventoryManagementView/table/InventoryManagementTable"
import XLSX from "xlsx"
import * as xlsx from "sheetjs-style"

const Dashboard = () => {
    const dispatch = useDispatch()
    const [calculatedMonthIncome, setCalculatedMonthIncome] = useState(0)
    const goodItems = useSelector(selectDashboardGoodInventory)
    const warningItems = useSelector(selectDashboardWarningInventory)
    const criticalItems = useSelector(selectDashboardCriticalInventory)
    const monthIncome = useSelector(selectIncomeMonth)
    const incomeStats = useSelector(selectIncomeStats)

    const [goodOpen, setGoodOpen] = useState(false)
    const [warningOpen, setWarningOpen] = useState(false)
    const [criticalOpen, setCriticalOpen] = useState(false)

    useEffect(() => {
        dispatch(dashboardActions.getDashboardDetails())
        dispatch(incomeActions.getIncomeLogsDetails())
    }, [dispatch])

    // const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"

    useEffect(() => {
        if (monthIncome) {
            let income = 0
            monthIncome.map((item) => {
                income += item.amount
            })
            setCalculatedMonthIncome(income)
        }
    }, [monthIncome])

    const handleItemsType = (status) => {
        switch (status) {
            case 1: return goodItems
            case 2: return warningItems
            case 3: return criticalItems
            default: return goodItems
        }
    }

    // eslint-disable-next-line no-unused-vars
    const genStockReport = (type, fileName) => {

        const workbook = xlsx.utils.book_new()
        const ws = xlsx.utils.json_to_sheet(type)
        xlsx.utils.book_append_sheet(workbook, ws, "Results")
        xlsx.writeFile(workbook, `${fileName}.xlsx`, {type: 'file'})
    }

    const generateIncomeReport = (fileName) => {
        const workbook = xlsx.utils.book_new()
        const ws = xlsx.utils.json_to_sheet(calculatedMonthIncome)
        xlsx.utils.book_append_sheet(workbook, ws, "Results")
        xlsx.writeFile(workbook, `${fileName}.xlsx`, {type: 'file'})
    }

    const generateIncomeMovementReport = (fileName) => {
        const workbook = xlsx.utils.book_new()
        const ws = xlsx.utils.json_to_sheet(incomeStats)
        xlsx.utils.book_append_sheet(workbook, ws, "Results")
        xlsx.writeFile(workbook, `${fileName}.xlsx`, {type: 'file'})
    }

    const generateItems = (fileName) => {
        const workbook = xlsx.utils.book_new()
        const ws = xlsx.utils.json_to_sheet(goodItems)
        xlsx.utils.book_append_sheet(workbook, ws, "Results")
        xlsx.writeFile(workbook, `${fileName}.xlsx`, {type: 'file'})
    }


    return <div>
        <h1 className='f-Staatliches mb-2'>Inventory Section</h1>
        <Row>
            <div style={{width: '30%'}}>
                <Card style={{height: '40vh'}}>
                    <CardBody>
                        <ResponsiveContainer>
                            <BarChart data={[
                                {
                                    name: "Track level",
                                    good: goodItems.length - (warningItems.length + criticalItems.length),
                                    warning: warningItems.length,
                                    critical: criticalItems.length
                                }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Legend/>
                                <Bar barSize={40} dataKey="good" fill="rgba(46, 213, 115, 0.6)"/>
                                <Bar barSize={40} dataKey="warning" fill="rgba(255, 165, 2, 0.6)"/>
                                <Bar barSize={40} dataKey="critical" fill="rgba(235, 77, 75, 0.6)"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </div>
            <div style={{
                width: '70%'
            }}>
                <Row>
                    <Col lg={4}>
                        <Card style={{height: '40vh'}}>
                            <CardHeader className='text-medium font-bold'>LEVEL: GOOD</CardHeader>
                            <CardBody className='d-center flex-column'>
                                <div>
                                    <Check size={100} color='rgba(46, 213, 115,1.0)'/>
                                </div>
                                <div>
                                    <b className='text-large text-success'>{goodItems.length  - (warningItems.length + criticalItems.length)} ITEM(S)</b>
                                </div>
                            </CardBody>
                            <CardFooter onClick={() => setGoodOpen(!goodOpen)} className='d-center'>
                                Click to see items
                            </CardFooter>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <Card style={{height: '40vh'}}>
                            <CardHeader className='text-medium font-bold'>LEVEL: WARNING</CardHeader>
                            <CardBody className='d-center flex-column'>
                                <div>
                                    <AlertTriangle size={100} color='#fbc531'/>
                                </div>
                                <div>
                                    <b className='text-large text-warning'>{warningItems.length} ITEM(S)</b>
                                </div>
                            </CardBody>
                            <CardFooter onClick={() => setWarningOpen(!warningOpen)} className='d-center'>
                                Click to see items
                            </CardFooter>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <Card style={{height: '40vh'}}>
                            <CardHeader className='text-medium font-bold'>LEVEL: CRITICAL</CardHeader>
                            <CardBody className='d-center flex-column'>
                                <div>
                                    <Activity size={100} color='#eb4d4b'/>
                                </div>
                                <div>
                                    <b className='text-large text-danger'>{criticalItems.length} ITEM(S)</b>
                                </div>
                            </CardBody>
                            <CardFooter onClick={() => setCriticalOpen(!criticalOpen)} className='d-center'>
                                Click to see items
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Row>
        <Row className='d-flex align-items-baseline'>
            <Col lg={3}>
                <Card
                    onClick={() => generateItems('this month added stocks')}
                    className='btn'>
                    <CardBody className='d-center align-items-baseline'>
                        <p className='text-medium m-0 p-0'>This month items:</p>
                        <h4 className='ml-2 mb-0 p-0 font-bold'>{goodItems.length}</h4>
                    </CardBody>
                </Card>
            </Col>
            <Col lg={3}>
                <Card className='btn btn-gradient-success'>
                    <CardBody onClick={() => genStockReport(handleItemsType(1), "success-stock")} className='d-center align-items-baseline'>
                        <p className='text-medium m-0 p-0'>Success Stock Report</p>
                    </CardBody>
                </Card>
            </Col>

            <Col lg={3}>
                <Card className='btn btn-gradient-warning'>
                    <CardBody onClick={() => genStockReport(handleItemsType(2), "warning-stock")} className='d-center align-items-baseline'>
                        <p className='text-medium m-0 p-0'>Warning Stock Report</p>
                    </CardBody>
                </Card>
            </Col>

            <Col lg={3}>
                <Card className='btn btn-gradient-danger'>
                    <CardBody onClick={() => genStockReport(handleItemsType(3), "critical-stock")} className='d-center align-items-baseline'>
                        <p className='text-medium m-0 p-0'>Danger Stock Report</p>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <hr/>
        <h1 className='f-Staatliches mb-3 mt-3'>Income Section</h1>
        <Row>
            <Col lg={3}>
                <Card style={{height: '25vh'}}>
                    <CardHeader className='text-medium font-bold'>Total income this Month</CardHeader>
                    <CardBody className='d-center flex-column'>
                        {/*<div className='mb-1'>*/}
                        {/*    <DollarSign size={25} color='rgba(46, 213, 115,1.0)'/>*/}
                        {/*</div>*/}
                        <div>
                            <b style={{
                                fontSize: 25
                            }} className='text-success'>{calculatedMonthIncome}/=</b>
                        </div>
                    </CardBody>
                    <CardFooter className='d-center text-grey'>
                        Based on the system uploaded sales
                    </CardFooter>
                </Card>

                <Card style={{height: '25vh'}}>
                    <CardHeader className='text-medium font-bold'>Total sales this month</CardHeader>
                    <CardBody className='d-center flex-column'>
                        {/*<div className='mb-1'>*/}
                        {/*    <Target size={25} color='#7468f0'/>*/}
                        {/*</div>*/}
                        <div>
                            <b style={{
                                fontSize: 25
                            }} className='text-primary'>{monthIncome.length}</b>
                        </div>
                    </CardBody>
                    <CardFooter className='d-center text-grey'>
                        Based on the system uploaded sales
                    </CardFooter>
                </Card>

                <Card onClick={() => generateIncomeReport('income-report')} className='btn btn-gradient-primary'>
                    <CardBody className='d-center align-items-baseline'>
                        <p className='text-medium m-0 p-0'>Generate Income Report</p>
                    </CardBody>
                </Card>

                <Card onClick={() => generateIncomeMovementReport('income-movement')} className='btn btn-gradient-success'>
                    <CardBody className='d-center align-items-baseline'>
                        <p className='text-medium m-0 p-0'>Generate income movement</p>
                    </CardBody>
                </Card>

            </Col>
            <Col lg={9}>
                <IncomeReportChart/>
            </Col>
        </Row>

        {/*--------------------------------------*/}
        {/*----Good level items modal started----*/}
        {/*--------------------------------------*/}
        <Modal size="xl"
               className='modal-dialog-centered' isOpen={goodOpen} toggle={() => setGoodOpen(!goodOpen)} backdrop={3}>
            <ModalHeader toggle={() => setGoodOpen(!goodOpen)}>
                <h3 className='m-0 p-0 f-Staatliches'>STOCK LEVEL: GOOD</h3>
            </ModalHeader>
            <ModalBody>
                <InventorManagementTable stockItems={goodItems}/>
            </ModalBody>
        </Modal>
        {/*---------------------*/}
        {/*----Good level items modal finished----*/}
        {/*---------------------*/}

        {/*--------------------------------------*/}
        {/*----Good level items modal started----*/}
        {/*--------------------------------------*/}
        <Modal size="xl"
               className='modal-dialog-centered' isOpen={warningOpen} toggle={() => setWarningOpen(!warningOpen)} backdrop={3}>
            <ModalHeader toggle={() => setWarningOpen(!warningOpen)}>
                <h3 className='m-0 p-0 f-Staatliches'>STOCK LEVEL: WARNING</h3>
            </ModalHeader>
            <ModalBody>
                <InventorManagementTable stockItems={warningItems}/>
            </ModalBody>
        </Modal>
        {/*---------------------*/}
        {/*----Good level items modal finished----*/}
        {/*---------------------*/}

        {/*--------------------------------------*/}
        {/*----Good level items modal started----*/}
        {/*--------------------------------------*/}
        <Modal size="xl"
               className='modal-dialog-centered' isOpen={criticalOpen} toggle={() => setCriticalOpen(!criticalOpen)} backdrop={3}>
            <ModalHeader toggle={() => setCriticalOpen(!criticalOpen)}>
                <h3 className='m-0 p-0 f-Staatliches'>STOCK LEVEL: CRITICAL</h3>
            </ModalHeader>
            <ModalBody>
                <InventorManagementTable stockItems={goodItems}/>
            </ModalBody>
        </Modal>
        {/*---------------------*/}
        {/*----Good level items modal finished----*/}
        {/*---------------------*/}
    </div>
}

export default Dashboard

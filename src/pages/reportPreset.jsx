import {Document, Page, Text, View, StyleSheet, PDFViewer, Image} from "@react-pdf/renderer";
import {Table, TR, TH, TD} from '@ag-media/react-pdf-table';
import { createTw } from "react-pdf-tailwind";
import {useEffect, useState} from "react";
import MainRequests from "../services/requests.js";
import { useLocation } from 'react-router-dom'

// The 'theme' object is your Tailwind theme config
const th_style = " text-sm justify-center p-1 border-gray-200";
const td_style = " text-xs items-center justify-center border-gray-200 p-1"
const requests = new MainRequests()
const on_revenues = true


const tw = createTw({
    theme: {
        fontFamily: {
            sans: ["Comic Sans"],
        },
        extend: {
            colors: {
                custom: "#bada55",
            },
        },
    },
});

const InvoicePDF = ({revenues, expenses, information}) => (
    <Document>
        <Page size={"A4"} style={tw("p-12 w-full")}>
            <View style={tw("flex flex-row justify-start gap-2 items-end border border-gray-200 rounded-t-md m-0 p-2")}>
                <View >
                    <Image src="../images/ADEB-logo.png" source={"Logo-ADEB"} style={tw("w-[30px] h-15 ")}/>
                </View>
                <View style={tw("text-6xl")}>
                    <Text>ADEB</Text>
                </View>
            </View>
            <View style={tw("flex flex-row text-sm justify-end items-end border border-gray-200 m-0 p-2")}>
                <Text>Data: {new Date().getDate()}/{String(new Date().getMonth() + 1).padStart(2, "0") }/{new Date().getFullYear()}</Text>
            </View>
            <View style={tw("flex flex-row justify-start gap-2 items-end border border-gray-200 m-0 p-2")}>
                <View style={tw("w-full pl-[10px] text-sm")}>
                    <Text style={tw("space-x-20")}>Igreja: {information.branch}</Text>
                    <Text>Pastor local: {information.branch_owner}</Text>
                    <Text>Tesoureiro: {information.user_name}</Text>
                </View>
                <View style={tw("w-full pl-[10px] text-sm")}>
                    <Text>Coordenador setorial: {information.sectorial_coordinator}</Text>
                    <Text>Setor: {information.sector_name}</Text>
                </View>
            </View>
            <View style={tw("border border-gray-200 m-0 p-2 gap-6")}>
                {information?.resume &&(
                    <View>
                        <Table style={tw("w-full")}>
                            <TH>
                                <TD style={tw(th_style)}>Total Receitas</TD>
                                <TD style={tw(th_style)}>Total Gastos</TD>
                                <TD style={tw(th_style)}>Saldo</TD>
                            </TH>
                            <TR>
                                <TD style={tw(td_style)}>R$ {revenues[0]?.revenues_sum !== undefined ? revenues[0].revenues_sum : 0 }</TD>
                                <TD style={tw(td_style)}>R$ {expenses[0]?.expenses_sum !== undefined ? expenses[0].expenses_sum : 0}</TD>
                                <TD style={tw(td_style)}>R$ {((revenues[0]?.revenues_sum !== undefined ? parseFloat(revenues[0].revenues_sum) : 0) - (expenses[0]?.expenses_sum !== undefined ? parseFloat(expenses[0].expenses_sum) : 0)).toFixed(2)}</TD>
                            </TR>
                        </Table>
                    </View>
                )}

                {revenues.length !== 0 && information?.resume && (<View>
                    <Text style={tw("text-lg ")}>Receitas</Text>
                    <Table style={tw("w-full")}>
                        <TH>
                            <TD style={tw(th_style)}>nome</TD>
                            <TD style={tw(th_style)}>data</TD>
                            <TD style={tw(th_style)}>valor</TD>
                        </TH>
                        {revenues?.length > 0 && revenues.map((revenue) => (

                            <TR key={revenue.id}>
                                <TD style={tw(td_style)}>{revenue.member}</TD>
                                <TD style={tw(td_style)}>
                                    {new Date(revenue.date).toLocaleDateString("pt-BR", {
                                        timeZone: "UTC",
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}</TD>
                                <TD style={tw(td_style)}>R${revenue.value}</TD>
                            </TR>
                        ))}
                        <TR>
                            <TD style={tw("flex-1 px-2 text-xs items-center justify-center border-gray-200")}>TOTAL</TD>
                            <TD style={tw(td_style)}>R$ {revenues[0]?.revenues_sum}</TD>
                        </TR>
                    </Table>
                </View>)}
                {expenses?.length > 0 && information?.expenses && (<View>
                    <Text style={tw("text-lg ")}>Gastos</Text>
                    <Table style={tw("w-full")}>
                        <TH>
                            <TD style={tw(th_style)}>nome</TD>
                            <TD style={tw(th_style)}>data</TD>
                            <TD style={tw(th_style)}>valor</TD>
                        </TH>
                        {expenses.map((expense) => (
                            <TR key={expense.id} >
                                <TD style={tw(td_style)}>{expense.title}</TD>
                                <TD style={tw(td_style)}>
                                    {new Date(expense.date).toLocaleDateString("pt-BR", {
                                        timeZone: "UTC",
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}</TD>
                                <TD style={tw(td_style)}>R$ {expense.value}</TD>
                            </TR>
                        ))}

                        <TR>
                            <TD style={tw("flex-1 px-2 text-xs items-center justify-center border-gray-200")}>TOTAL</TD>
                            <TD style={tw(td_style)}>R$ {expenses[0]?.expenses_sum}</TD>
                        </TR>
                    </Table>
                </View>)}
            </View>

        </Page>
    </Document>
);

export default function ReportPreset(){
    const [revenues, setRevenues] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [information, setInformation] = useState([]);
    const location = useLocation();

    const {report_id} = location.state || {}
    async function onGetData() {
        try {
            const reports_data = await requests.onGet(`reports/${report_id}`)
            setInformation(reports_data[0]?.items)

            try{
                const branch_data = await requests.onGet(`branches/${reports_data?.branch}`)
                const sector_data = await requests.onGet(`sectors/${reports_data?.sector}`)

                setInformation(branch_data[0], sector_data[0], ...information)
            }catch (error) {
                console.log(error)
            }

            if (reports_data?.items.revenues !== false ) {
                try{
                    const revenues_response = await requests.onGet(`revenues/${reports_data?.start_date}/${reports_data?.end_date}`);
                    setRevenues(revenues_response);
                }catch(error){
                    console.log(error);
                }
            }
            if (reports_data?.items.expenses !== false ) {
                try{
                    const expenses_response = await requests.onGet(`expenses/${reports_data?.start_date}/${reports_data?.end_date}`);
                    setExpenses(expenses_response);
                }catch(error){
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        onGetData().then();
    },[]);

    return (

        <div className={"h-full w-full"}>
            <PDFViewer style={tw("h-[100%] w-[100%]")} >
                <InvoicePDF revenues={revenues} expenses={expenses} information={information}/>
            </PDFViewer>
        </div>

    );
}
import {Document, Page, Text, View, StyleSheet, PDFViewer, Image, Font} from "@react-pdf/renderer";

import {Table, TR, TH, TD} from '@ag-media/react-pdf-table';
import { createTw } from "react-pdf-tailwind";
import {use, useEffect, useState} from "react";
import MainRequests from "../services/requests.js";
import { useLocation } from 'react-router-dom'
import {FormateMonetaryValue} from "../services/formatService.js";

Font.registerHyphenationCallback((word) => [word]);

// The 'theme' object is your Tailwind theme config
const th_style = "flex-1 text-sm justify-center p-1 border-gray-200";
const td_style = "flex-1 text-xs items-start justify-center border-gray-200 p-1"
const requests = new MainRequests()
const on_revenues = true


const tw = createTw({
    theme: {
        extend: {
            colors: {
                custom: "#bada55",
            },
        },
    },
});

const s = StyleSheet.create({
    table: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 4 },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    rowAlt: { backgroundColor: "#fafafa" },
    head: { backgroundColor: "#f3f4f6" },
    cell: { fontSize: 9, color: "#111827" },
    cellBold: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
    colName: { flex: 3, textAlign: "left", paddingRight: 8 },
    colDate: { flex: 1.2, textAlign: "center" },
    colValue: { flex: 1.5, textAlign: "right" },
    col: {flex: 1, textAlign: "center"}
});

const formatDate = (d) =>
    new Date(d).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

const DataTable = ({ rows, nameKey, total }) => (
    <View style={s.table}>
        <View style={[s.row, s.head]}>
            <Text style={[s.cellBold, s.colName]}>Nome</Text>
            <Text style={[s.cellBold, s.colDate]}>Data</Text>
            <Text style={[s.cellBold, s.colValue]}>Valor</Text>
        </View>

        {rows.map((row, i) => (
            // wrap={false}: uma linha nunca é cortada ao meio entre duas páginas
            <View key={row.id} style={[s.row, i % 2 ? s.rowAlt : {}]} wrap={false}>
                <Text style={[s.cell, s.colName]}>{row[nameKey]}</Text>
                <Text style={[s.cell, s.colDate]}>{formatDate(row.date)}</Text>
                <Text style={[s.cell, s.colValue]}>{FormateMonetaryValue(row.value)}</Text>
            </View>
        ))}

        <View style={[s.row, s.head]} wrap={false}>
            <Text style={[s.cellBold, s.colName]}>TOTAL</Text>
            <Text style={[s.cellBold, s.colDate]}></Text>
            <Text style={[s.cellBold, s.colValue]}>{FormateMonetaryValue(total)}</Text>
        </View>
    </View>
);

const InvoicePDF = ({revenues, expenses, information}) => (
    <Document>
        <Page size={"A4"} style={tw("p-12 w-full")}>
            <View style={tw("flex flex-row justify-start gap-2 items-end border border-gray-200 rounded-t-md m-0 p-2")}>
                <View >
                    <Image src="../images/ADEB-logo.png" source={"Logo-ADEB"} style={tw("w-[30px] h-15 ")}/>
                </View>
                <View style={tw("text-6xl")}>
                    <Text>{information.institution?.name}</Text>
                </View>
            </View>
            <View style={tw("flex flex-row text-sm justify-end items-end border border-gray-200 m-0 p-2")}>
                <Text>Data: {new Date().getDate()}/{String(new Date().getMonth() + 1).padStart(2, "0") }/{new Date().getFullYear()}</Text>
            </View>
            <View style={tw("flex flex-row justify-start gap-2 items-end border border-gray-200 m-0 p-2")}>
                <View style={tw("w-full pl-[10px] text-sm")}>
                    <Text style={tw("space-x-20")}>Filial: {information.branch?.name}</Text>
                    <Text>Diretor local local: {information.branch?.owner}</Text>
                    <Text>Tesoureiro: {information.user?.name}</Text>
                </View>
                <View style={tw("w-full pl-[10px] text-sm")}>
                    <Text>Coordenador setorial: {information.sector?.sectorial_cordenator}</Text>
                    <Text>Setor: {information.sector?.name}</Text>
                </View>
            </View>
            <View style={tw("border border-gray-200 m-0 p-2 gap-6")}>
                {information.items?.resume &&(
                    <View style={s.table}>
                        <View style={[s.row, s.head]}>
                            <Text style={[s.cellBold, s.col]}>Total Receitas</Text>
                            <Text style={[s.cellBold, s.col]}>Total Gastos</Text>
                            <Text style={[s.cellBold, s.col]}>Saldo</Text>
                        </View>
                        <View style={[s.row]} wrap={false}>
                            <Text style={[s.cell, s.col]}>{revenues[0]?.revenues_sum !== undefined ? FormateMonetaryValue(revenues[0].revenues_sum) : 0 }</Text>
                            <Text style={[s.cell, s.col]}>{expenses[0]?.expenses_sum !== undefined ? FormateMonetaryValue(expenses[0].expenses_sum) : 0}</Text>
                            <Text style={[s.cell, s.col]}>{FormateMonetaryValue(((revenues[0]?.revenues_sum !== undefined ? parseFloat(revenues[0].revenues_sum) : 0) - (expenses[0]?.expenses_sum !== undefined ? parseFloat(expenses[0].expenses_sum) : 0)).toFixed(2))}</Text>
                        </View>
                    </View>
                )}

                {revenues.length > 0 && information.items?.revenues && (
                    <View>
                        <Text style={tw("text-lg mb-2")}>Receitas</Text>
                        <DataTable rows={revenues} nameKey="member" total={revenues[0]?.revenues_sum} />
                    </View>
                )}

                {expenses?.length > 0 && information.items?.expenses && (
                    <View>
                        <Text style={tw("text-lg mb-2")}>Gastos</Text>
                        <DataTable rows={expenses} nameKey="title" total={expenses[0]?.expenses_sum} />
                    </View>
                )}
            </View>

        </Page>
    </Document>
);

export default function ReportPreset() {
    const [revenues, setRevenues] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [information, setInformation] = useState({});
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const { report_id } = location.state || {};

    async function onGetData() {
        if (!report_id) return;

        try {
            const reports_data = await requests.onGet(`reports/${report_id}`);
            const report = reports_data?.[0]; // Guardamos o primeiro item em uma variável limpa

            console.log(report);

            if (!report) return;

            // 1. Busca branch e sector em paralelo para melhor performance
            let branch_data = null;
            let sector_data = null;
            let user_data;
            let institution_data = null;

            try {

                [branch_data, sector_data, user_data] = await Promise.all([
                    report.branch ? requests.onGet(`branches/${report.branch}`) : null,
                    report.sector ? requests.onGet(`sectors/${report.sector}`) : null,
                    report.by ? requests.onGet(`users/${report.by}`) : null
                ]);

                console.log(branch_data, sector_data);

                [institution_data] = await Promise.all([
                    branch_data.institution ? requests.onGet(`institutions/${branch_data.institution}`) : null,
                ])

                console.log(institution_data)
            } catch (error) {
                console.log("Erro ao buscar filial/setor:", error);
            }

            // 2. Atualiza o estado de uma só vez usando array com os dados coletados
            const updatedInformation = {
                items: (report ? report.items : []),
                branch: (branch_data ? branch_data: []),
                sector: (sector_data ? sector_data : []),
                user: (user_data ? user_data : []),
                institution: (institution_data ? institution_data : [])
                };

            setInformation(updatedInformation);


            // 3. Busca de receitas e despesas (Corrigido: acessando report.start_date em vez de reports_data)
            if (report.items?.revenues && report.start_date && report.end_date) {
                try {
                    const revenues_response = await requests.onGet(`revenues/${new Date(report.start_date).toISOString()}/${new Date(report.end_date).toISOString()}`);
                    setRevenues(revenues_response);
                } catch (error) {
                    console.log("Erro receitas:", error);
                }
            }

            if (report.items?.expenses && report.start_date && report.end_date) {
                try {
                    const expenses_response = await requests.onGet(`expenses/${new Date(report.start_date).toISOString()}/${new Date(report.end_date).toISOString()}`);
                    setExpenses(expenses_response);
                } catch (error) {
                    console.log("Erro despesas:", error);
                }
            }

        } catch (error) {
            console.log("Erro principal:", error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        onGetData();
    }, []);

    if (loading || !information) {
        return <div className="flex h-full w-full items-center justify-center">Carregando relatório...</div>;
    }

    return (
        <div className="h-full w-full">
            {console.log(information.institution)}
            <PDFViewer style={tw("h-[100%] w-[100%]")}>
                <InvoicePDF revenues={revenues} expenses={expenses} information={information} />
            </PDFViewer>
        </div>
    );
}
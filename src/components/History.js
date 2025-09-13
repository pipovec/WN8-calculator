import React, { useEffect, useState } from "react";
import LineChart from "./Chart";
import moment from "moment";

const History = ({ tankId }) => {
    const [historyData, setHistoryData] = useState([]);
    const [charts, setCharts] = useState({
        frags: [],
        dmg: [],
        spot: [],
        def: [],
        win: [],
    });

    useEffect(() => {
        if (tankId > 0) {
            getHistoryData();
        }
    }, [tankId]);

    const getHistoryData = async () => {
        const date = moment().day(-14).format("YYYY-MM-DD");
        const urlApi = new URL(
            `https://api2.fpcstat.cz/api/expected_tank_value_histories`
        );

        const params = {
            tank_id: tankId,
            "date[after]": date,
            "order[date]": "DESC",
        };

        urlApi.search = new URLSearchParams(params).toString();

        try {
            const response = await fetch(urlApi, {
                headers: { Accept: "application/json" },
            });
            const json = await response.json();
            setHistoryData(json);
            setCharData(json);
        } catch (error) {
            console.error("Error fetching history data:", error);
        }
    };

    const setCharData = (data) => {
        setCharts({
            frags: data.map((el) => ({ y: el.frag, x: el.date })),
            dmg: data.map((el) => ({ y: el.dmg, x: el.date })),
            spot: data.map((el) => ({ y: el.spot, x: el.date })),
            def: data.map((el) => ({ y: el.def, x: el.date })),
            win: data.map((el) => ({ y: el.win, x: el.date })),
        });
    };

    return (
        <div className="w3-row">
            <div className="w3-col l6 m12">
                <LineChart data={charts.frags} name="Frags history" />
            </div>
            <div className="w3-col l6 m12">
                <LineChart data={charts.dmg} name="Damage history" />
            </div>
            <div className="w3-col l6 m12">
                <LineChart data={charts.spot} name="Spot history" />
            </div>
            <div className="w3-col l6 m12">
                <LineChart data={charts.def} name="Def history" />
            </div>
            <div className="w3-col l6 m12">
                <LineChart data={charts.win} name="Win history" />
            </div>
            <div className="w3-col l6 m12 w3-center">
                <a href="https://etvh.fpcstat.cz">More data range for ETV</a>
            </div>
        </div>
    );
};

export default History;

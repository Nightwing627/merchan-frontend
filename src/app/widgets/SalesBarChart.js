import React, { useEffect, useMemo, useRef } from "react";
import { Chart } from "chart.js";

import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

const charBarColors = ["#6F7CFC", "#F4C42F"];

export default function SalesBarChart({ title, totalNum, desc, status }) {
  const ref = useRef();
  const data = useMemo(
    () => ({
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          backgroundColor:
            status === "down" ? charBarColors[0] : charBarColors[1],
          data: [15, 20, 25, 30, 25, 20, 15, 20, 25, 30, 25, 20],
        },
      ],
    }),
    [status]
  );

  useEffect(() => {
    const chart = new Chart(ref.current, {
      data,
      type: "bar",
      options: {
        title: { display: true },
        tooltips: {
          intersect: false,
          mode: "nearest",
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10,
        },
        legend: { display: false },
        responsive: true,
        maintainAspectRatio: false,
        barRadius: 4,
        scales: {
          xAxes: [{ display: true, gridLines: false, stacked: true }],
          yAxes: [{ display: false, stacked: true, gridLines: false }],
        },
        layout: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data]);

  return (
    <div className="kt-portlet kt-portlet--height-fluid">
      <div className="kt-portlet__head">
        <div className="kt-portlet__head-label">
          <h3 className="kt-portlet__head-title">{title}</h3>
        </div>
      </div>
      <div className="kt-portlet__body">
        <div className="kt-widget1">
          <div className="kt-widget1__item ng-star-inserted">
            <div className="kt-widget1__info">
              <h3 className="kt-widget1__title">Total</h3>
              <span
                className="kt-widget1__desc"
                style={{ fontSize: "32px", fontWeight: "bold" }}
              >
                {totalNum}
              </span>
            </div>
            <span className="kt-widget1__number">
              {status === "down" ? (
                <ArrowDownwardIcon style={{ color: "#C7806E" }} />
              ) : (
                <ArrowUpwardIcon style={{ color: "#67B58B" }} />
              )}

              {desc}
            </span>
          </div>
        </div>
        <div className="kt-widget14__chart" style={{ minHeight: 300 }}>
          <canvas ref={ref} />
        </div>
      </div>
    </div>
  );
}

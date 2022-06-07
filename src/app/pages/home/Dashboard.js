import React from "react";
import SalesBarChart from "../../widgets/SalesBarChart";
import RecentActivities from "../../widgets/RecentActivities";

export default function Dashboard() {
  return (
    <>
      <div className="row">
        <div className="col-xl-4">
          <SalesBarChart
            title="Tenders"
            totalNum="654"
            desc="24%"
            status="down"
          />
        </div>{" "}
        <div className="col-xl-4">
          <SalesBarChart
            title="Revenues"
            totalNum="R$1.7K"
            desc="17%"
            status="up"
          />
        </div>
        <div className="col-xl-4">
          <RecentActivities />
        </div>
      </div>
    </>
  );
}

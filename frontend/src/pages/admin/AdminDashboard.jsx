import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Overview from "./Overview";
import MenuManager from "./MenuManagement";
import OrdersManager from "./OrdersManagement";
import ReservationsManager from "./ReservationsManagement";
import Customers from "./Customers";

export default function AdminDashboard() {
    const [activeSection, setActiveSection] = useState("overview");

    const renderSection = () => {
        switch (activeSection) {
            case "menu":
                return <MenuManager />;
            case "orders":
                return <OrdersManager />;
            case "reservations":
                return <ReservationsManager />;
            case "customers":
                return <Customers />;
            default:
                return <Overview />;
        }
    };

    return (
        <div className="flex min-h-screen bg-black">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <div className="flex-1">
                <Topbar />
                <div className="p-6">{renderSection()}</div>
            </div>
        </div>
    );
}
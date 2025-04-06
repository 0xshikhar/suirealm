"use client";
import React, { useEffect } from "react";

// Declare the global bracketsViewer type
declare global {
    interface Window {
        bracketsViewer: {
            render: (config: {
                stages: any[];
                matches: any[];
                groups: any[];
                participants: any[];
            }) => void;
        }
    }
}

const BracketView = () => {
    async function fetchData() {
        try {
            const response = await fetch("/api/db");
            console.log("response found!");
            const data = await response.json();
            console.log("data", data);
            window.bracketsViewer.render({
                stages: data.stage,
                matches: data.match,
                groups: data.group,
                participants: data.participant,
            });
            // const convertedData = convertData(data);
            if (response.ok) {
                console.log("success");
            } else {
                console.log("Failed to fetch data:", response.statusText);
            }
        } catch (error) {
            alert(
                "Failed to fetch data from localhost. Please make sure the server is running."
            );
            console.error(error);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    return <div className="brackets-viewer"></div>;
};

export default BracketView;
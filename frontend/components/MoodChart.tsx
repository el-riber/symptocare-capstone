
"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function MoodChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Mood Level",
        data: [2, 3, 4, 2, 5, 4, 5],
        borderColor: "rgb(59,130,246)", // Tailwind blue-500
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} />;
}

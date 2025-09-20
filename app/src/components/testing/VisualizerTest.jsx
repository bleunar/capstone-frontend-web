import { BarVisualizer, PieVisualizer, LineVisualizer } from "../visualizer/Visualizers";

const VisualizerTest = () => {
  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: "Reported Issues",
        data: [1,3,5,1,1,2,3],
        backgroundColor: "rgba(192, 75, 75, 0.75)"
      },
      {
        label: "Completed Issues",
        data: [1,3,4,2,1,2,3],
        backgroundColor: "rgba(89, 192, 75, 0.75)"
      }
    ]
  };

  const pieData = {
    labels: ["Operational", "Issues", "Monitored"],
    datasets: [
      {
        label: "Data",
        data: [59, 19, 3],
        backgroundColor: ["#a1ff63ff", "#eb3636ff", "#ffb656ff"]
      },
    ]
  };

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Administrators",
        data: [3, 2, 4, 6, 1, 7],
        borderColor: "rgba(85, 192, 75, 1)",
        fill: false,
        tension: 0.0
      },
      {
        label: "Technicians",
        data: [8, 11, 4, 16, 21,23],
        borderColor: "rgba(106, 75, 192, 1)",
        fill: false,
        tension: 0.0
      },
      {
        label: "HK Lab Assistants",
        data: [33, 21, 14, 16, 11,21],
        borderColor: "rgba(75,192,192,1)",
        fill: false,
        tension: 0.0
      },
    ]
  };

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3">
      <div className="col p-2">
        <LineVisualizer title="Account Activity" data={lineData} />
      </div>
      <div className="col p-2">
        <BarVisualizer title="Sales Report" data={barData} />
      </div>
      <div className="col p-2">
        <PieVisualizer title="Components" data={pieData} />
      </div>
    </div>

  );
};

export default VisualizerTest;

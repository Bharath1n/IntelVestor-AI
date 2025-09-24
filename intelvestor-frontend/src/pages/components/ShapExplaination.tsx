import { Bar } from 'react-chartjs-2';
interface ShapProps {
  shap: { feature: string; value: number }[];
  explanation: string;
}

const ShapExplaination: React.FC<ShapProps> = ({ shap, explanation }) => {
  const data = {
    labels: shap.map((s: { feature: string }) => s.feature),
    datasets: [
      {
        label: 'SHAP Values',
        data: shap.map((s: { value: number }) => s.value),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>SHAP Explanation</h2>
      <Bar data={data} />
      <p>{explanation}</p>
    </div>
  );
};

export default ShapExplaination;
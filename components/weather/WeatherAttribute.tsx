const WeatherAttribute = ({ label, value, unit }) => {
  return (
    <div className="gap-4 bg-primary rounded-2xl shadow-md shadow-black flex w-1/2 flex-col justify-center items-center">
      <strong>{label}</strong> {value} {unit}
    </div>
  );
};

export default WeatherAttribute;

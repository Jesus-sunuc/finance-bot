import { useFinanceQuery } from "../hooks/FinanceHooks";

const Home = () => {
  const { data: finances } = useFinanceQuery();
  return (
    <div>
      {finances.map((finance, index) => (
        <div key={index}>
          <h2>{finance.name}</h2>
          <p>Created at: {finance.createdAt.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;

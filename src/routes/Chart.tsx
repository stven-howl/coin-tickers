import { useQuery } from "react-query";
import { useLocation, useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "./api";
import styled from "styled-components";
import ApexChart from "react-apexcharts";
import { useAtomValue } from "jotai";
import { isDarkAtom } from "./atoms";

interface ICoinId {
  coinId: string;
}

interface IHistoricalData {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

const Loader = styled.span`
  font-size: 20px;
  color: ${(props) => props.theme.textColor};
  text-align: center;
  display: block;
`;

function Chart() {
  const isDark = useAtomValue(isDarkAtom);
  const { coinId } = useOutletContext<ICoinId>();
  const { isLoading, data } = useQuery<IHistoricalData[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    { refetchInterval: 10000 }
  );
  return (
    <div>
      {isLoading ? (
        <Loader>"Loading chart..."</Loader>
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: "Closing Price",
              data: data?.map((price) => parseFloat(price.close)) ?? [],
            },
          ]}
          options={{
            theme: { mode: isDark ? "dark" : "light" },
            chart: {
              height: 500,
              width: 500,
              toolbar: { show: false },
              background: "transparent",
            },
            stroke: {
              curve: `smooth`,
              width: 4,
            },
            grid: { show: false },
            yaxis: { show: false },
            xaxis: {
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { show: false },
              type: "datetime",
              categories: data?.map((price) =>
                new Date(price.time_close * 1000).toUTCString()
              ),
            },
            fill: {
              type: "gradient",
              gradient: {
                gradientToColors: [`#44bd32`],
                stops: [0, 100],
              },
            },
            colors: ["#0fbcf9"],
            tooltip: {
              y: { formatter: (value) => `${value.toFixed(2)}` },
              x: { show: false },
              marker: { show: false },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;

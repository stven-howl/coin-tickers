import { useParams, useLocation, Outlet, Link, useMatch } from "react-router";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "./api";
import { Helmet } from "react-helmet-async";
import { FaChevronCircleLeft } from "react-icons/fa";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 35px;
  color: ${(props) => props.theme.accentColor};
`;

const Back = styled.span`
  a {
    color: ${(props) => props.theme.textColor};
  }
  text-align: center;
  position: fixed;
  left: 10px;
  top: 44px;
`;

const Loader = styled.span`
  font-size: 25px;
  color: ${(props) => props.theme.textColor};
  text-align: center;
  display: block;
`;

const InfoRow = styled.div`
  background-color: ${(props) => props.theme.strongBgColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  border-radius: 10px;
  margin: 15px 0px;
`;

const InfoColunm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoTitle = styled.span`
  font-size: 8px;
  margin: 5px;
  font-weight: 400;
`;

const InfoContent = styled.span`
  margin-bottom: 5px;
`;

const Description = styled.p`
  font-size: 10px;
`;

const TabRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 10px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  background-color: ${(props) => props.theme.strongBgColor};
  padding: 5px 0px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 400;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

interface RouteState {
  state: { name: string };
}

interface IInfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface IPriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const { coinId } = useParams();
  const { state } = useLocation() as RouteState;

  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");

  const { isLoading: infoLoading, data: infoData } = useQuery<IInfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<IPriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId)
  );

  const loading = infoLoading || tickersLoading;

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Back>
          <Link to={`/`}>
            <FaChevronCircleLeft />
          </Link>
        </Back>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <InfoRow>
            <InfoColunm>
              <InfoTitle>RANK:</InfoTitle>
              <InfoContent>{infoData?.rank}</InfoContent>
            </InfoColunm>
            <InfoColunm>
              <InfoTitle>SYMBOL:</InfoTitle>
              <InfoContent>{infoData?.symbol}</InfoContent>
            </InfoColunm>
            <InfoColunm>
              <InfoTitle>Price:</InfoTitle>
              <InfoContent>${tickersData?.quotes.USD.price}</InfoContent>
            </InfoColunm>
          </InfoRow>
          <Description>{infoData?.description}</Description>
          <InfoRow>
            <InfoColunm>
              <InfoTitle>TOTAL SUPPLY:</InfoTitle>
              <InfoContent>{tickersData?.total_supply}</InfoContent>
            </InfoColunm>
            <InfoColunm>
              <InfoTitle>Max SUPPLY:</InfoTitle>
              <InfoContent>{tickersData?.max_supply}</InfoContent>
            </InfoColunm>
          </InfoRow>
          <TabRow>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`} state={{ coinId }}>
                Chart
              </Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </TabRow>
          <Outlet context={{ coinId }} />
        </>
      )}
    </Container>
  );
}

export default Coin;

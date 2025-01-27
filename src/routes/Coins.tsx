import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCoins } from "./api";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import { useSetAtom } from "jotai";
import { isDarkAtom } from "./atoms";
import { FaRegMoon } from "react-icons/fa6";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    position: fixed;
    left: 10px;
    top: 55px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.bgColor};
    border: 1px solid ${(props) => props.theme.textColor};
    color: ${(props) => props.theme.textColor};
    padding: 0px;
  }
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  border: 1px solid ${(props) => props.theme.textColor};
  margin-bottom: 10px;
  border-radius: 15px;
  a {
    transition: color 0.2s ease-in-out;
    display: flex;
    align-items: center;
    padding: 20px;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

interface CoinInterface {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  font-size: 40px;
  color: ${(props) => props.theme.textColor};
  text-align: center;
  display: block;
`;

const IMG = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 5px;
`;

function Coins() {
  const setDarkAtom = useSetAtom(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
  const { isLoading, data } = useQuery<CoinInterface[]>("allCoins", fetchCoins);
  return (
    <Container>
      <Helmet>
        <title>Coins</title>
      </Helmet>
      <Header>
        <Title>Coins</Title>
        <button onClick={() => toggleDarkAtom()}>
          <FaRegMoon />
        </button>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link to={`/${coin.id}`} state={{ name: coin.name }}>
                <IMG
                  src={`https://cryptoicon-api.pages.dev/api/icon/${coin.symbol.toLowerCase()}`}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;

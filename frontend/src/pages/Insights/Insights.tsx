import { useEffect } from "react";

export default function MarketDataPage() {
  useEffect(() => {
    // Load TradingView Advanced Chart Widget
    const scriptChart = document.createElement("script");
    scriptChart.src = "https://s3.tradingview.com/tv.js";
    scriptChart.async = true;
    scriptChart.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          width: "100%",
          height: 500,
          symbol: "BSE:RELIANCE",
          interval: "D",
          timezone: "Asia/Kolkata",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          withDateRanges: true,
          hide_side_toolbar: false,
          details: true,
          hotlist: true,
          calendar: true,
          container_id: "tradingview_chart",
        });
      }
    };
    document.body.appendChild(scriptChart);

    // Load Market Overview Widget
    const scriptOverview = document.createElement("script");
    scriptOverview.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    scriptOverview.async = true;
    scriptOverview.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      width: "100%",
      height: "400",
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: true,
      allow_symbol_change: true, 
      plotLineColorGrowing: "rgba(25, 118, 210, 1)",
      plotLineColorFalling: "rgba(25, 118, 210, 1)",
      gridLineColor: "rgba(42, 46, 57, 1)",
      scaleFontColor: "rgba(120, 123, 134, 1)",
      belowLineFillColorGrowing: "rgba(33, 150, 243, 0.12)",
      belowLineFillColorFalling: "rgba(33, 150, 243, 0.12)",
      symbolActiveColor: "rgba(33, 150, 243, 0.12)",
      tabs: [
        { title: "Indices", symbols: [{ s: "FOREXCOM:SPXUSD", d: "S&P 500" }, { s: "INDEX:NKY", d: "Nikkei 225" }], originalTitle: "Indices" },
        { title: "Forex", symbols: [{ s: "FX:EURUSD" }], originalTitle: "Forex" },
        { title: "Crypto", symbols: [{ s: "CRYPTO:BTCUSD" }], originalTitle: "Crypto" }
      ]
    });
    document.getElementById("tradingview_market_overview")?.appendChild(scriptOverview);

    // Cleanup on unmount
     return () => {
      document.body.removeChild(scriptChart);
      const chartContainer = document.getElementById("tradingview_chart");
      if (chartContainer) chartContainer.innerHTML = "";
      const overviewContainer = document.getElementById("tradingview_market_overview");
      if (overviewContainer) overviewContainer.innerHTML = "";
    };
  }, []);

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Stock Chart</h3>
          <div className="tradingview-widget-container">
            <div id="tradingview_chart" className="w-full"></div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Market Overview</h3>
          <div className="tradingview-widget-container">
            <div id="tradingview_market_overview" className="w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
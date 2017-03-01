/**
 * Created by necklace on 2017/3/1.
 */
import React from "react";
import BaseComponent from "../BaseComponent";
import utils from "../../../common/utils";
import BalanceComponent from "../Utility/BalanceComponent";
import FormattedAsset from "../Utility/FormattedAsset";
import CanBuySell from "./CanBuySell";

class CurrentBalance extends BaseComponent {
    static propTypes = {
        isAsk: React.PropTypes.bool,
        latestPrice: React.PropTypes.object
    };

    static defaultProps = {
        isAsk: false
    };

    constructor(props) {
        super(props);
    }

    render() {
        let {quoteAsset, baseAsset, currentAccount, latestPrice, isAsk}=this.props;
        let base = null, quote = null, accountBalance = null, quoteBalance = null,
            baseBalance = null, coreBalance = null, quoteSymbol, baseSymbol, aSymbol, bSymbol, balance;
        if (quoteAsset.size && baseAsset.size && currentAccount.size) {
            base = baseAsset;
            quote = quoteAsset;
            baseSymbol = base.get("symbol");
            quoteSymbol = quote.get("symbol");

            accountBalance = currentAccount.get("balances").toJS();

            if (accountBalance) {
                for (let id in accountBalance) {
                    if (id === quote.get("id")) {
                        quoteBalance = accountBalance[id];
                    }
                    if (id === base.get("id")) {
                        baseBalance = accountBalance[id];
                    }
                    if (id === "1.3.0") {
                        coreBalance = accountBalance[id];
                    }
                }
            }
        }
        if (isAsk) {
            aSymbol = quote;
            bSymbol = base;
            balance = quoteBalance;
        } else {
            aSymbol = base;
            bSymbol = quote;
            balance = baseBalance;
        }

        return (
            <div className="current-balance">
                <div>
                    <p>{this.formatMessage("transaction_currentBalance", {symbol: utils.getAssetName(aSymbol)})}:&nbsp;
                        <label className="green">
                            {balance == null ?
                                <FormattedAsset hide_asset={true} amount={0} asset={aSymbol.get('id')}/> :
                                <BalanceComponent balance={balance} hide_asset={true}/>}
                        </label>
                    </p>
                    <p>{this.formatMessage(isAsk ? "transaction_canSell" : "transaction_canBuy", {symbol: utils.getAssetName(bSymbol)})}:&nbsp;
                        {balance == null ? 0 :
                            <CanBuySell isAsk={isAsk} balance={balance} price={latestPrice}
                                        fromAsset={aSymbol.get('id')}/>
                        }
                    </p>
                </div>
                <div></div>
            </div>
        );
    }
}

export default CurrentBalance;
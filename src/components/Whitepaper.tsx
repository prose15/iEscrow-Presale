import { useEffect, useState } from "react";
import WhitepaperLogo from "../assets/images/Logo_v2.png";
import OurMission from "../assets/images/our_mission.png";
import Hiybrid from "../assets/images/hybrid.png";
import Privacy from "../assets/images/Privacy.png";
import iEscrowapp from "../assets/images/iEscrowapp.png";
import R_and_R_System from "../assets/images/R_and_R_System.png";
import Referrals from "../assets/images/Referrals.png";
import Pie_chart from "../assets/images/Pie_chart.png";
import Effective_tokens from "../assets/images/Effective_tokens.png";
import Launch_and_Distribution from "../assets/images/Launch_Distribution.png";
import Roadmap from "../assets/images/Roadmap.png";

export default function Whitepaper({ setOpenWhitepaper }: { setOpenWhitepaper: (open: boolean) => void }) {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const toggleSection = (section: number) => {
    setActiveSection(activeSection === section ? null : section);
  };

  useEffect(() => {
    if (activeSection !== null) {
      const activeSectionContainer = document.getElementById('section' + '-' + activeSection)
      if (activeSectionContainer) {
        activeSectionContainer.scrollIntoView({
          behavior: 'smooth'
        })
      }
    }
  }, [activeSection])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0
    })
  }, [])

  const handleCloseWhitepaper = () => {
    window.scrollTo({
      top: 0,
      left: 0
    })
    setOpenWhitepaper(false)
  }

  return (
    <section id='whitepaper-container' className="relative text-text-primary min-h-screen py-28 px-4">
      {/* Botón fijo para cerrar */}
      <button
        onClick={handleCloseWhitepaper}
        className="fixed bottom-6 right-6 z-50 bg-[#1b80a4] hover:bg-[#196986] duration-200 text-white px-4 py-2 rounded-lg shadow-lg transition-colors cursor-pointer"
      >
        Close Whitepaper
      </button>

      <div className="container mx-auto max-w-5xl py-8 px-4 bg-slate-800/20 rounded-xl">
        {/* Header */}
        <div className="text-center mb-12">
          <img src={WhitepaperLogo} alt="Logo" className="justify-self-center w-48" />
          <h2 className="text-2xl text-text-secondary font-semibold mb-2 mt-4">
            The First Hybrid CEX/DEX
          </h2>
          <h3 className="text-xl text-text-secondary mb-12">P2P Escrow Exchange</h3>
          <h4 className="text-md text-text-secondary mb-12">Whitepaper v1.0</h4>
          <hr className="border-b border-gray-700 pt-4" />
        </div>

        {/* Table of Contents */}
        <div className="mb-12 p-6 rounded-lg">
          <div className="space-y-3 text-sm ">
            {/* Section 1 */}
            <div>
              <button
                onClick={() => toggleSection(1)}
                className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer font-semibold w-full"
              >
                1- Introduction
              </button>
              <div className="ml-4 mt-1 space-y-1">
                <button
                  onClick={() => document.getElementById('section-1-1')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  1.1 Current security challenges in the cryptocurrency ecosystem and the reason the iEscrow ecosystem was created
                </button>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <button
                onClick={() => toggleSection(2)}
                className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer font-semibold w-full"
              >
                2- iEscrow and the $ESCROW token
              </button>
              <div className="ml-4 mt-1 space-y-1">
                <button
                  onClick={() => document.getElementById('section-2-1')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  2.1 What is iEscrow?
                </button>
                <button
                  onClick={() => document.getElementById('section-2-2')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  2.2 What is the $ESCROW Utility Token?
                </button>
                <button
                  onClick={() => document.getElementById('section-2-3')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  2.3 Our mission, solution and value proposition
                </button>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <button
                onClick={() => toggleSection(3)}
                className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer font-semibold w-full"
              >
                3- Key Benefits of the iEscrow Platform and the $ESCROW Utility Token
              </button>
              <div className="ml-4 mt-1 space-y-1">
                <button
                  onClick={() => document.getElementById('section-3-1')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  3.1 Hybrid CEX/DEX exchange
                </button>
                <button
                  onClick={() => document.getElementById('section-3-2')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  3.2 Deflationary Shares
                </button>
                <button
                  onClick={() => document.getElementById('section-3-3')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  3.3 Staking bonuses, and locked staking benefits
                </button>
                <button
                  onClick={() => document.getElementById('section-3-4')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  3.4 $ESCROW token burn
                </button>
                <button
                  onClick={() => document.getElementById('section-3-5')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  3.5 Privacy
                </button>
                <button
                  onClick={() => document.getElementById('section-3-6')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  3.6 Our focus on security and the iEscrow protocol audits
                </button>
                <button
                  onClick={() => document.getElementById('section-3-7')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  3.7 iEscrow Exchange Mobile App for iOS and Android
                </button>
                <button
                  onClick={() => document.getElementById('section-3-8')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  3.8 iEscrow Exchange's New Reputation And Rating System
                </button>
                <button
                  onClick={() => document.getElementById('section-3-81')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  3.81 Referral System
                </button>
                <button
                  onClick={() => document.getElementById('section-3-9')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  3.9 iEscrow's Marketplace
                </button>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <button
                onClick={() => toggleSection(4)}
                className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer font-semibold w-full"
              >
                4- iEscrow Exchange and $ESCROW Utility Token Functionality
              </button>
              <div className="ml-4 mt-1 space-y-1">
                <button
                  onClick={() => document.getElementById('section-4-1')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  4.1 Tokenomics
                </button>
                <button
                  onClick={() => document.getElementById('section-4-2')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  4.2 Staking functions, rewards and penalties
                </button>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <button
                onClick={() => toggleSection(5)}
                className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer font-semibold w-full"
              >
                5- Presale
              </button>
              <div className="ml-4 mt-1 space-y-1">
                <button
                  onClick={() => document.getElementById('section-5-1')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  5.1 Presale date, process, duration, and rounds
                </button>
                <button
                  onClick={() => document.getElementById('section-5-2')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  5.2 Accepted tokens for the $ESCROW limited presale
                </button>
                <button
                  onClick={() => document.getElementById('section-5-3')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer block text-text-secondary"
                >
                  5.3 Presale Token Distribution and $ESCROW Launch
                </button>
              </div>
            </div>

            {/* Section 6 */}
            <div>
              <button
                onClick={() => toggleSection(6)}
                className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer font-semibold w-full"
              >
                6- Roadmap
              </button>
            </div>

            {/* Section 7 */}
            <div>
              <button
                onClick={() => toggleSection(7)}
                className="text-left hover:text-primary transition-colors duration-200 py-1 cursor-pointer font-semibold w-full"
              >
                7- Conclusion
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-20">
          {/* Section 1 */}
          <section id="section-1" className=" rounded-lg p-6">
            <h2
              className="text-2xl font-bold mb-12 cursor-pointer hover:text-primary transition-colors duration-200"
              onClick={() => toggleSection(1)}
            >
              1- Introduction
            </h2>

            <h3 id='section-1-1' className="text-xl font-semibold mb-12 text-text-secondary">
              1.1 Current security challenges in the cryptocurrency ecosystem and the reason the iEscrow ecosystem was created
            </h3>

            <div className="space-y-4 text-text-secondary px-4">
              <p className='mb-8'>
                As with any technological advancement, new products and services come with a variety of challenges that can only be solved with time, development, intelligence and effort. The cryptocurrency ecosystem is no exception to that, as scams and security exploits tend to happen on a daily basis, even after more than 15 years since Bitcoin was invented.
              </p>

              <p className='mb-8'>
                Billions of dollars worth of crypto are lost yearly, hurting retail and institutional investors alike. This is more than enough reason to conclude a definitive solution is needed, since the people that are being directly affected, despite having to deal with the worst part, are not the only ones that are negatively impacted. Every single cryptocurrency investor is affected by scammers stealing people's cryptocurrency funds, because the stolen crypto is usually sold, negatively affecting the prices of the whole ecosystem. In light of this, having a strong focus on security helps cryptocurrency become an even better form of money, and solving this issue becomes extremely important for everyone in the world to want to invest in this ecosystem without worrying about losing their funds to scams and exploits.
              </p>

              <p className='mb-8'>
                Crypto scams continue to drain billions from investors and platforms every year, and most projects underestimate how critical these risks truly are. Reports indicate that fraudulent schemes and technical exploits have caused losses exceeding tens of billions of dollars globally, making scams one of the most damaging forces in the digital asset space. The trend shows no signs of slowing down, with billions lost in just a matter of months.
              </p>

              <p className='mb-8'>
                High-profile incidents highlight the scale of this problem. In some of the largest single breaches recorded, attackers have stolen over a billion dollars worth of digital assets within minutes by compromising private keys. Other cases have seen hundreds of millions misappropriated through wallet manipulation, or millions taken from decentralized protocols by exploiting permission flaws in vaults. These events demonstrate that exchanges and platforms in general remain vulnerable when security is not airtight.
              </p>

              <p className='mb-8'>
                This is the reason why the iEscrow ecosystem was created, and a compelling evidence that cryptocurrency needs to be fixed in a number of ways to be able to fully onboard the whole world and claim its rightful place as the perfect money, fully decentralized, with no middlemen, and democratized since governments won't be able to inflate it indefinitely.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className=" rounded-lg p-6">
            <h2
              className="text-2xl font-bold mb-12 cursor-pointer hover:text-primary transition-colors duration-200"
              onClick={() => toggleSection(2)}
            >
              2- iEscrow and the $ESCROW token
            </h2>

            <div className="space-y-8 px-4">
              <div>
                <h3 id='section-2-1' className="text-xl font-semibold mb-12 text-text-secondary">
                  2.1 What is iEscrow?
                </h3>
                <div className="space-y-4 text-text-secondary">
                  <p className='mb-8'>
                    iEscrow is a cryptocurrency peer to peer hybrid CEX/DEX escrow exchange. It constitutes an upgrade to the traditional centralized P2P escrows, utilizing smart contracts to improve security. Since it's hybrid, users can benefit from both centralized and decentralized capabilities according to their needs and preference. When operating with unknown users, or users that don’t yet have an established reputation, the decentralized escrow option is ideal since it’s completely trustless (both users have to fulfill their responsibilities or else the funds return to the sender). On the other hand, when operating with known users, or users that have a great reputation and many transactions, the centralized escrow can be used, lowering the fees since it’s all offchain.
                  </p>

                  <p className='mb-8'>
                    Users can choose between private escrows when transacting with users they know, or public escrows posted on the marketplace. Being a hybrid CEX/DEX lets users enjoy the benefits of DeFi while still having a customer support, or enjoy CeFi offchain transactions with lower fees, effectively combining the best of both worlds since users can operate the iEscrow exchange in the way they see fit. Users don’t even need to hold their funds inside the iEscrow exchange wallet when operating with the decentralized escrow service, since the escrow wallet can receive the funds either from centralized exchanges or custodial wallets. In addition, users can hold $ESCROW on the platform to lower the exchange operational fees by 25%.
                  </p>

                  <p className='mb-8'>
                    Finally, the exchange supports hybrid transactions, meaning a user sending crypto can use DeFi and the user that receives crypto can get the funds offchain, or vice versa.
                  </p>
                </div>
              </div>

              <div>
                <h3 id='section-2-2' className="text-xl font-semibold my-16 text-text-secondary">
                  2.2 What is the $ESCROW Utility Token?
                </h3>
                <div className="space-y-4 text-text-secondary">
                  <p className='mb-8'>
                    $ESCROW is the utility token of the iEscrow hybrid CEX/DEX P2P crypto exchange. It was built on the shoulders of giants, not only with top-tier tokenomics, like a limited presale to mitigate sell pressure during launch, deflationary shares, token burns that decrease supply over time creating scarcity, among others, but also with a focus on security. With two security audits conducted by Certik, the gold standard of crypto security, $ESCROW provides cryptocurrency users with an amazing quality product. 
                  </p>

                  <p className='mb-8'>
                    Furthermore, the iEscrow exchange and the $ESCROW utility token mutually support each other. By holding $ESCROW and thus increasing its price, investors are allowing the iEscrow exchange to operate on lower fees, compared to the regular fee that would be paid using any other cryptocurrency. Additionally, the existence of the iEscrow exchange helps burn a percentage of the fees paid with $ESCROW, lowering its supply over time and creating scarcity. Moreover, the exchange by design contributes massive value to $ESCROW by being its native utility token.
                  </p>

                  <p className='mb-8'>
                    $ESCROW benefits early investors and holders not only through its unparalleled tokenomics, but also by adding enormous value to the iEscrow exchange, lowering its fees and being the official utility token of an exchange solving a real-world problem and delivering significant value to the cryptocurrency ecosystem.
                  </p>
                </div>
              </div>

              <div>
                <h3 id='section-2-3' className="text-xl font-semibold my-16 text-text-secondary">
                  2.3 Our mission, solution and value proposition
                </h3>
                <div className="space-y-4 text-text-secondary">
                  <p className='mb-8'>
                    We understand that in order for the cryptocurrency ecosystem to thrive, high value projects must be launched. We believe each and every investor has a chance to change the world by buying a position in the right projects, since each and every investment in a project makes it bigger, it amplifies them. We need to make the right projects bigger, the ones that drive growth to the cryptocurrency ecosystem.
                  </p>

                  <p className='mb-8'>
                    Our mission is to significantly contribute to mitigate scams in the cryptocurrency ecosystem when paying for products and services, by using both centralized and decentralized P2P escrow transactions in the iEscrow exchange. This allows any user to transact with any other, known or unknown, since both have to fulfill their responsibility for the transaction to take place.
                  </p>

                  <p className='mb-20'>
                    Solving the security issues in the cryptocurrency ecosystem is going to make it much more attractive to conservative investors and institutions, and that is our mission.
                  </p>
                </div>
                <img src={OurMission} alt="Our Mission" className="rounded-lg mt-8 object-contain justify-self-center" />
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className=" rounded-lg p-6">
            <h2
              className="text-2xl font-bold mb-12 mt-10 cursor-pointer hover:text-primary transition-colors duration-200"
              onClick={() => toggleSection(3)}
            >
              3- Key Benefits of the iEscrow Platform and the $ESCROW Utility Token
            </h2>

            <div className="space-y-8 px-4">
              <div>
                <h3 id='section-3-1' className="text-xl font-semibold mb-12 mt-20 text-text-secondary">
                  3.1 Hybrid CEX/DEX exchange
                </h3>
                <div className="space-y-4 text-text-secondary">
                  <p className='mb-20'>
                    A great advantage of this platform is that although we have wallets for all the most important cryptocurrencies, the funds do not necessarily have to be in those wallets, that is, the iEscrow wallets, so that users can operate on the platform. But two users can operate with the funds in any wallet external to the platform.
                  </p>
                  <img src={Hiybrid} alt="Hybrid" className="rounded-lg mt-8 object-contain justify-self-center my-20" />
                  <p className='mb-8'>
                    Users could hold their funds on Binance, OKX, Kucoin, or any other platform, and they can complete an escrow transaction even though the funds are not in the iEscrow wallet. This is because the escrow wallet that is created specifically for a transaction does not care where the funds arrive from, but only cares that the funds do arrive, so that the transaction can be carried out. Therefore, this allows users to carry out transactions without first having to transfer their funds to the iEscrow wallet, and have them wherever they see fit, whether it is on our platform or any other. This is a feature that makes iEscrow very different from the vast majority of other platforms, that do require the funds to be within their specific centralized wallets in order to operate. Does this mean that the platform does not have its own wallets for users to hold their crypto? Not at all, we do provide wallets in case users prefer to hold their crypto on our platform, but the key difference is that holding funds on iEscrow is optional, not required, for the transactions to take place.
                  </p>
                </div>
              </div>

              <div>
                <h3 id='section-3-2' className="text-xl font-semibold my-16 text-text-secondary">
                  3.2 Deflationary Shares
                </h3>
                <div className="space-y-4 text-text-secondary">
                  <p className='mb-8'>
                    When staking your $ESCROW tokens, they are burned and you receive shares instead. Then, upon stake maturity when users end their stakes they lose their shares and the tokens are minted along with their accrued yield. These shares are deflationary, as the share price always goes up through a mechanism explained later in this document. As a result, over time, users need more $ESCROW tokens to acquire the same number of shares, resulting in fewer shares in circulation. Initially, a quadrillion shares (or C-share) is going to cost 10,000 $ESCROW tokens, but over time this price is going to steadily increase. Every day 0.01% of the total supply is calculated and distributed proportionally to the percentage of shares that each user has. So staking for longer periods of time lets users lock in cheaper shares for longer and earn more yield, since the payout per C-Share increases over time due to the decreasing number of shares in the system relative to a fairly stable token supply.
                  </p>
                </div>
              </div>

              <div>
                <h3 id='section-3-3' className="text-xl font-semibold my-16 text-text-secondary">
                  3.3 Staking bonuses, and locked staking benefits
                </h3>
                <div className="space-y-4 text-text-secondary">
                  <p className='mb-8'>
                    After careful consideration, we chose a locked staking mechanism for several reasons. First of all, with this mechanism users tend to lock their tokens for longer periods of time on average, resulting in much better price performance over time compared to flexible staking. This is of course extremely beneficial for stakers and holders as opposed to a flexible staking approach, which is the preferred choice of day-traders. Since trading is a zero sum game, in the bigger picture traders are going to try to extract value, so it made sense to choose the mechanism that benefits the most deserving users.
                  </p>
                  <p className='mb-8'>
                    In the same way, staking bonuses benefit users that stake larger amounts and/or for longer periods of time. This system benefits users that trust the project the most and that want to hold $ESCROW the longest.
                  </p>
                  <p className='mb-8'>
                    There are two types of bonuses, the quantity bonus and the time bonus. Stakers can earn up to 10% more yield by staking larger amounts and up to 3x more by staking longer (more information about the bonuses in 4.2).
                  </p>
                </div>
              </div>

              <div>
                <h3 id='section-3-4' className="text-xl font-semibold my-16 text-text-secondary">
                  3.4 $ESCROW token burn
                </h3>
                <div className="space-y-4 text-text-secondary">
                  <p className='mb-8'>
                    We understand the value of scarcity and the consequences of creating an ecosystem where this is not only present, but also implemented in a way that’s most efficient and maximally beneficial to our users.  There are two ways in which $ESCROW tokens are permanently burned.  The first way is through staking penalties. For example, in the case that an emergency end stake is performed (more information on 4.2) and a penalty is applied to the earned yield, 25% of that penalty is burned forever, and 50% of that penalty goes to stakers proportionally to their percentage of shares in the system. The second way $ESCROW is burned forever is by using the iEscrow exchange. On every transaction, 25% of every fee is used to buy $ESCROW from the open market in case the fee is paid with any token other than $ESCROW, and burn it forever; and in case the iEscrow exchange fee is fully paid in $ESCROW, the user not only gets a 25% discount on said fee, but also 25% of it is burned forever.
                  </p>
                </div>
              </div>

              <div>
                <h3 id='section-3-5' className="text-xl font-semibold my-16 text-text-secondary">
                  3.5 Privacy
                </h3>
                <div className="space-y-4 text-text-secondary">
                  <p className='mb-8'>
                    At iEscrow, we have no interest in knowing who is using the service; our only interest is in ensuring the service reaches as many people as possible. We value the privacy of our users, and for this reason, regarding the use of the iEscrow hybrid CEX/DEX P2P escrow exchange, we won’t implement KYC/AML in any of the countries where this is not mandatory. Users can simply use iEscrow as a DEX and KYC/AML won’t be necessary at all. We’ll just implement KYC/AML for the presale of $ESCROW and when users utilize iEscrow as a CEX, since today being in compliance is in fact in the users best interest, because nowadays in order to get listed in many of the major centralized exchanges, cryptocurrency projects need to be in compliance, and also because being in compliance attracts many institutional and smart money investors.
                  </p>

                  <p className='mb-8'>
                    We considered not operating in countries where KYC is mandatory, but we believe that preventing even a single person from being scammed is more important than avoiding those jurisdictions on ethical grounds concerning KYC. Therefore, our premise is to operate in as many countries as possible. We think it’s better to be present and ensure people are not scammed, than to not be present at all. Even if we can prevent a single user from being scammed, it completely justifies our service being available in any country.
                  </p>
                  <img src={Privacy} alt="Privacy" className="rounded-lg my-20 object-contain justify-self-center" />
                </div>
              </div>

              <div>
                <h3 id='section-3-6' className="text-xl font-semibold my-12 text-text-secondary">
                  3.6 Our focus on security and the iEscrow protocol audits
                </h3>
                <div className="space-y-4 text-text-secondary">
                  <p className='mb-8'>
                    Since iEscrow is helping address the security challenges of the cryptocurrency ecosystem and contribute to crypto becoming the perfect form of money, it was of course of paramount importance for it to be built with a robust security foundation. We analyzed several success cases in the industry, and developed our ecosystem on the shoulders of giants, with regard to what we believe is right, suitable, marketable, and more secure.
                  </p>
                  <p className='mb-8'>
                    Our main source of motivation was that even in those success cases, we identified various aspects for improvement, not only regarding the security of those particular protocols, but also in the unmet demand for a definitive solution to exchange goods and services paid for with crypto in a secure way, avoiding potential scams that still occur in the cryptocurrency ecosystem.
                  </p>
                  <p className='mb-8'>
                    Besides innovation and commercial viability, it was clear to us right from the start that our investors would be looking not just for a great product, but also one that’s above the security standards of the crypto industry. That’s why from the very beginning we decided that $ESCROW and the iEscrow exchange would have at least two security audits. We selected Certik to conduct these audits and work closely with our team, achieving exceptional results.
                  </p>
                </div>
              </div>

              <div>
                <h3 id='section-3-7' className="text-xl font-semibold my-16 text-text-secondary">
                  3.7 iEscrow Exchange Mobile App for iOS and Android
                </h3>
                <div className="space-y-4 text-text-secondary">
                  <img src={iEscrowapp} alt="Our App" className="rounded-lg my-20 object-contain justify-self-center" />
                  <p className='mb-8'>
                    Considering that the vast majority of online traffic comes from mobile devices, adopting a mobile-first approach was the natural choice. To provide our users with the best possible experience, developing an iEscrow mobile app quickly became self-evident. That’s why we have built an iOS and an Android iEscrow mobile app.
                  </p>
                </div>
              </div>

              <div>
                <h3 id='section-3-7' className="text-xl font-semibold my-16 text-text-secondary">
                  3.8 iEscrow Exchange's New Reputation And Rating System
                </h3>
                <div className="space-y-4 text-text-secondary">
                  <img src={R_and_R_System} alt="R&R System" className="rounded-lg my-20 object-contain justify-self-center" />
                  <p className='mb-8'>
                    We have developed an innovative reputation and rating system, completely new and unlike anything on other platforms, which focuses on security and the most accurate representation of a user’s behavior and performance on the platform. Any user can view not only how many transactions the other party has done, but also the percentage of transactions that involved opening a dispute, as well as the percentage of completed and canceled escrows, etc. This is where we differentiate ourselves and what makes our reputation system unparalleled. All this available information is key to let users choose the best possible counterparties in the marketplace.
                  </p>
                  <p className='mb-8'>
                    In addition, our reputation system includes a defined set of conditions that determine whether a dispute should appear on a user’s public profile. This approach is a significant improvement over traditional systems because it ensures that user reputations more accurately reflect actual behavior on the platform. When users evaluate whether to transact with someone, having insight into dispute frequency and resolution provides a greater sense of security, especially when interacting with users who have a high completion rate and few or no disputes.
                  </p>
                  <p className='mb-8'>
                    Transparency is central to our reputation model, but the right to rate the other party is conditional. Depending on how a dispute is resolved, one or both users may lose the ability to submit a rating.
                  </p>
                  <p className='mb-8'>
                    For example, consider a case where one user acts entirely in bad faith while the other follows all platform rules. If the user who behaved poorly is allowed to rate, they may attempt to downplay their misconduct by rating the other party unfairly. This distorts the reputation system. To avoid this, our model requires users to earn the right to rate, helping ensure more accurate, merit-based feedback.
                  </p>
                  <p className='mb-8'>
                    So what are the conditions to be able to rate a counterpart?
                  </p>

                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Both users may rate each other when the party who opened the dispute closes it voluntarily.</li>
                    <li>If your counterpart fully resolves the dispute before you close it, only they will retain the right to rate. In such cases, we check the timestamp of the payment to ensure it occurred before the recipient confirmed it.</li>
                    <li>If you open a dispute and your counterpart fails to resolve it, they lose the right to rate, and only you will be able to submit feedback.</li>
                  </ul>

                  <p className='mb-8'>
                    This system helps prevent biased and malicious ratings and promotes more accurate reputations. By prioritizing behavior-based merit, we enable more trust between high-performing users, maximizing successful transactions on the platform.
                  </p>
                  <p className='mb-8'>
                    Additionally, the in-app chat includes a special mode during dispute resolution. Once a dispute is open, the chat switches to a one-message-at-a-time format: a user must wait for a reply before sending another message. This guarantees that the resolution of the dispute is more effective and better organized.
                  </p>
                </div>
              </div>

              <div>
                <h3 id='section-3-7' className="text-xl font-semibold my-16 text-text-secondary">
                  3.81 Referral System
                </h3>
                <div className="space-y-4 text-text-secondary">
                  <p className='mb-8'>
                    We also have the referral system. This system is always extremely positive because it is a form of advertising, but instead of paying for physical or virtual spaces to display ads and billboards, the money stays within the community. In this case, it goes to the iEscrow platform users. We see it as a way of benefiting those who most deserve to be rewarded by the iEscrow exchange: the users who bring more people into our ecosystem.
                  </p>
                  <p className='mb-8'>
                    So, if a user knows someone who performs many transactions or does so regularly, they can benefit by recommending the platform. Not only will this benefit the person being referred thanks to the platform’s security and features, but the referring user also benefits by earning a percentage of the fee from each transaction made by the person they referred.
                  </p>
                  <img src={Referrals} alt="Referrals" className="rounded-lg my-20 object-contain justify-self-center" />
                </div>
              </div>

              <div>
                <h3 id='section-3-7' className="text-xl font-semibold my-16 text-text-secondary">
                  3.9 iEscrow's Marketplace
                </h3>
                <div className="space-y-4 text-text-secondary">
                  <p className='mb-8'>
                    Additionally, we have developed an amazing marketplace that empowers the user. On other platforms, we’ve seen phrases like "you are buying" or "you are selling", which we find insulting when exchanging cryptocurrency.Users know exactly what they are doing, and more importantly, in any transaction, one is always exchanging something, meaning you are virtually buying and selling at the same time. Therefore, telling the users whether they are buying or selling something is absurd, because fundamentally they are performing both actions.
                  </p>
                  <p className='mb-8'>
                    From a technical standpoint, we designed the user interface to help users quickly and effectively find a counterpart for their transaction, without needing to worry about whether they are buying or selling. The entire search process has been streamlined into just three dropdown menus: first, what the user wants to receive; second, how they want to pay; and third, the country. Users can transact with others across borders, introducing global competition among crypto sellers and helping them find the best available prices. In a competitive market, the user always wins, as more competition means lower fees and better deals.
                  </p>
                  <p className='mb-8'>
                    Once those three fields are selected, users can sort listings using a 'Sort by' button. By default, listings are sorted by lowest commission. Users can also choose to sort by the reputation of the listing’s creator, or by fastest response time. This ensures that users are presented with the most attractive options, whether that’s the lowest fee or the most reputable counterparty.
                  </p>
                  <p className='mb-8'>
                    We’ve built an intuitive marketplace that makes it easy to find exactly what you need by setting just three simple filters: 1) what you want to receive, 2) how you want to pay, and 3) the country you want to transact with. Finally, by combining flexible sorting options, users can quickly identify the best counterparties to transact with.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className=" rounded-lg p-6">
            <h2
              className="text-2xl font-bold mb-12 cursor-pointer hover:text-primary transition-colors duration-200"
              onClick={() => toggleSection(4)}
            >
              4- iEscrow Exchange and $ESCROW Utility Token Functionality
            </h2>

            <div className="space-y-8 px-4">
              <div>
                <h3 id='section-4-1' className="text-xl font-semibold my-16 text-text-secondary">
                  4.1 Tokenomics
                </h3>

                <h4 className="text-lg font-semibold mb-12 text-text-secondary">Locked staking</h4>
                <div className="space-y-4 text-text-secondary mb-7">
                  <p className='mb-8'>
                    The $ESCROW token has a locked staking mechanism. It allows token holders to commit their assets to a protocol for a fixed period of time in exchange for yield. We chose locked staking over flexible staking because with this mechanism users tend to commit their assets for longer periods of time, usually resulting in a much favourable price action. During the lock-up period, staked tokens enforce stability in the system and provide predictable liquidity conditions for the protocol.
                  </p>
                </div>

                <h4 className="text-lg font-semibold mb-5 text-text-secondary">Token burn</h4>
                <div className="space-y-4 text-text-secondary mb-12">
                  <p className='mb-8'>
                    $ESCROW is permanently burned in two different ways. The first occurs through penalties. Although $ESCROW uses a locked staking mechanism, users can still withdraw their assets at any time, but doing so incurs a penalty. As mentioned earlier in this document, this is referred to as an early end stake. 25% of the penalties are permanently burned, reducing the circulating supply and ensuring those $ESCROW tokens can never be sold in the market.
                  </p>

                  <p className='mb-8'>
                    The second burning mechanism takes place through the iEscrow exchange. When users pay transaction fees using $ESCROW, 25% of that fee is burned forever.
                  </p>
                </div>

                <h4 className="text-lg font-semibold mb-5 text-text-secondary">Deflationary shares</h4>
                <div className="space-y-4 text-text-secondary mb-12">
                  <p className='mb-8'>
                    When a user stakes their $ESCROW tokens, those tokens are burned and the user receives shares in return. Later, when the stake ends, the shares are permanently destroyed and the tokens are minted again.
                  </p>

                  <p className='mb-8'>
                    These shares determine the user’s percentage of the staking pool and, therefore, how much yield they earn each day. Each time a user ends a stake, the share price is recalculated, potentially resulting in a higher price according to the formula explained later in this document. The share price only moves upward over time, meaning it becomes increasingly expensive to acquire the same number of shares.
                  </p>

                  <p className='mb-8'>
                    This design prevents repeated short-term stakes from outperforming longer commitments, which are meant to be more rewarding.
                  </p>

                  <p className='mb-8'>
                    The greatest benefits go to users who stake earlier and for longer periods, as they receive more shares (since the share price is lower at the beginning and only increases) and earn rewards for a longer duration, resulting in a larger share of the daily distributed pool. Additionally, longer stakes can grant users a Time Bonus, further boosting their yield (full details can be found in section 4.2 of this document).
                  </p>
                </div>

                <h4 className="text-lg font-semibold mb-5 text-text-secondary">Distribution & Vesting</h4>
                <div className="space-y-4 text-text-secondary">
                  <p className='mb-8'>
                    The $ESCROW token distribution is structured as follows:
                  </p>

                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>5% Presale:</strong> A limited presale designed to mitigate sell pressure and benefit early investors.</li>
                    <li><strong>5% Liquidity pool:</strong> LP tokens will be locked for 4 years. After that period, if the DEX where the liquidity resides remains in the project’s best interest, the LP tokens will be permanently burned. Alternatively, they may be migrated to another DEX and locked for an additional 4 years.</li>
                    <li><strong>3.4% Treasury:</strong> Reserved for project funding, marketing, future development, CEX listings, and strategic partnerships.</li>
                    <li><strong>1% Founders, Team & Advisors:</strong> Locked for 3 years, then releasing 20% after that period, and 20% every 6 months (2 more years).</li>
                    <li><strong>85.6% Staking rewards:</strong> The main way of obtaining $ESCROW tokens. Locked staking users tend to lock in value for longer periods of time, resulting in better price action.</li>
                  </ul>

                  <img src={Pie_chart} alt="Chart" className="rounded-lg my-20 object-contain justify-self-center" />
                </div>

                <h4 className="text-lg font-semibold mb-5 text-text-secondary mt-6">Limited presale</h4>
                <div className="space-y-4 text-text-secondary">
                  <p className='mb-8'>
                    During the limited presale we are selling 5% of the max supply, which would be 5 billion $ESCROW tokens.
                  </p>

                  <p className='mb-8'>
                    Having a limited presale is extremely positive for the price, as sell pressure is almost completely eliminated from the start. Users who didn’t buy during the presale will have to buy in the open market, or participate in any of our adoption programs, resulting in more buy pressure and therefore pushing up the price of $ESCROW.
                  </p>
                </div>
              </div>

              <div>
                <h3 id='section-4-2' className="text-xl font-semibold my-16 text-text-secondary">
                  4.2 Staking functions, rewards and penalties
                </h3>

                <h4 className="text-lg font-semibold mb-5 text-text-secondary">Staking Bonuses</h4>
                <div className="space-y-4 text-text-secondary mb-12">
                  <p className='mb-8'>
                    Staking $ESCROW offers its own incentives that reward not only the amount of tokens staked, but also how long they are staked. These come in the form of a Quantity Bonus and a Time Bonus.
                  </p>
                </div>

                <h4 className="text-lg font-semibold mb-5 text-text-secondary">Quantity Bonus</h4>
                <div className="space-y-4 text-text-secondary mb-12">
                  <p className='mb-8'>
                    This bonus rewards the amount of tokens staked, and caps at 10% when staking 150 million $ESCROW. This means that any amount between 1 and 150 million $ESCROW receives a linear bonus of up to 10%, and any amount above 150 million $ESCROW still receives a 10% bonus relative to the staked quantity. The Quantity Bonus is not as powerful as the Time Bonus (which will be explained in the next section), as the latter provides much stronger price protection for $ESCROW.
                  </p>

                  <p className='mb-8 justify-self-center italic'>
                    Quantity Bonus Formula:<br />
                    (initial tokens up to 150,000,000) / 1,500,000,000
                  </p>
                </div>

                <h4 className="text-lg font-semibold mb-5 text-text-secondary">Time bonus</h4>
                <div className="space-y-4 text-text-secondary mb-12">
                  <p className='mb-8'>
                    This bonus rewards the duration of the stake, and is capped at 3x the amount of tokens committed when staking for 3,641 days or longer. As stated before, the Time Bonus is by far more powerful than the Quantity Bonus because it not only eliminates significantly more sell pressure, thus protecting the price of $ESCROW, but also rewards long-term commitment.
                  </p>

                  <p className='mb-8 justify-self-center italic'>
                    Time Bonus Formula:<br />
                    (initial tokens) × (days – 1) / 1820
                  </p>
                </div>

                <h4 className="text-lg font-semibold mb-5 text-text-secondary">Effective tokens</h4>
                <div className="space-y-4 text-text-secondary mb-12">
                  <img src={Effective_tokens} alt="Effective tokens" className="rounded-lg my-20 object-contain justify-self-center" />
                  <p className='mb-8'>
                    When starting a stake, users enter the amount of tokens they want to commit and the number of days they wish to stake them.
                  </p>

                  <p className='mb-8 justify-self-center italic'>
                    The amount of tokens + the Quantity Bonus + the Time Bonus = the effective tokens.
                  </p>

                  <p className='mb-8 justify-self-center italic'>
                    Effective tokens are used solely for conversion into C-Shares.
                  </p>

                  <p className='mb-8 justify-self-center italic'>
                    Effective tokens ÷ C-Share Price = Amount of C-Shares.
                  </p>

                  <p className='mb-8'>
                    For example, if a user wants to stake 125,000 $ESCROW for 1,000 days:
                  </p>

                  <p className='mb-8 justify-self-center italic'>
                    Quantity Bonus = (initial tokens up to 150,000,000) / 1,500,000,000 =<br />
                    125,000 $ESCROW / 1,500,000,000 = 0.008333% = 1,041.66 $ESCROW
                  </p>

                  <p className='mb-8 justify-self-center italic'>
                    Time Bonus = (initial tokens) × (days – 1) / 1820 =<br />
                    125,000 $ESCROW x (1000 - 1 days) / 1820 = 68,612.63 $ESCROW
                  </p>

                  <p className='mb-8 justify-self-center italic'>
                    Effective tokens = Initial tokens + Quantity Bonus + Time Bonus =<br />
                    125,000 + 1,041.66 + 68,612.63 $ESCROW = 194,654.29 $ESCROW
                  </p>

                  <p className='mb-8'>
                    If for example the C-Share Price is 11,500 $ESCROW (it starts at 10,000 $ESCROW and only increases), then:
                  </p>

                  <p className='mb-8 justify-self-center italic'>
                    Effective tokens / C-Share Price = Amount of C-Shares<br />
                    194,654.29 $ESCROW / 11,500 $ESCROW = 16.92646 C-Shares
                  </p>
                </div>

                <h4 className="text-lg font-semibold mb-5 text-text-secondary">Daily pool</h4>
                <div className="space-y-4 text-text-secondary mb-12">
                  <p className='mb-8'>
                    Every day at 00:00 UTC time, 0.01% of the total supply is distributed among all stakers according to the percentage of C-Shares they hold.
                  </p>
                </div>

                <h4 className="text-lg font-semibold mb-5 text-text-secondary">Emergency end stake, penalties and their distribution</h4>
                <div className="space-y-4 text-text-secondary mb-12">
                  <p className='mb-8'>
                    Stakers can still end their stakes before they mature by performing an Emergency End Stake. This may result in penalties on the earned yield, or even on the principal, depending on how close the stake is to maturity.
                  </p>

                  <p className='mb-8'>
                    Penalty rules are divided into two groups: (1) stakes shorter than 180 days, and (2) stakes equal to or longer than 180 days. Each group has its own parameters.
                  </p>

                  <p className='mb-8'>
                    {'1) Stakes shorter than 180 days have four penalty parameters:'}
                  </p>

                  <ul className="list-disc list-inside space-y-4 ml-4">
                    <li>
                      0 days completed formula: (estimated accrued yield × 90). Since the estimated accrued yield before the end of day 1 is equal to 0, the result is 0 × 90 = 0. Therefore, no penalties apply if an emergency end stake is performed before the completion of the first staking day. Each day ends at 00:00 UTC.
                    </li>
                    <li>
                      {'< 90 days completed: The penalty is determined by (estimated accrued yield × 50) ÷ (days elapsed).'}
                    </li>
                    <li>= 90 days completed: The principal is returned and all earned yield is forfeited.</li>
                    <li>{'> 90 days completed: The principal is returned along with the earned yield from day 91 onwards.'}</li>
                  </ul>

                  <p className='my-8'>
                    {'2) Stakes equal to or longer than 180 days have five penalty parameters:'}  
                  </p>

                  <ul className="list-disc list-inside space-y-4 ml-4">
                    <li>
                      0 days completed formula: (estimated accrued yield × half of the stake duration in days). Since the estimated accrued yield before the end of day 1 is equal to 0, the result is 0 × (half of the stake duration) = 0. Therefore, no penalties apply if an emergency end stake is performed before the end of the first day.
                    </li>
                    <li>
                      {'< 50% completed: The penalty is determined by (estimated accrued yield × half of the stake duration in days) ÷ (days elapsed).'}
                    </li>
                    <li>= 50% completed: The principal is returned and all earned yield is forfeited.</li>
                    <li>{'> 50% completed: The principal is returned along with the accrued yield starting from the day after half of the stake duration has passed (for example, in a 200-day stake, the staker receives the principal plus the accrued yield from day 101 until the day they perform the end stake).'}</li>
                  </ul>

                  <p className='my-8'>
                    Penalties are then distributed:
                  </p>

                  <ul className="list-disc list-inside space-y-4 ml-4">
                    <li>
                      25% is permanently burned.
                    </li>
                    <li>
                      50% goes to the daily payout pool to be distributed among active stakers.
                    </li>
                    <li>25% goes to an address controlled by the project.</li>
                  </ul>
                </div>

                <h4 className="text-lg font-semibold mb-5 text-text-secondary">End Stake and calculation of the new C-share price</h4>
                <div className="space-y-4 text-text-secondary mb-12">
                  <p className='mb-8'>
                    Once the staking period is 100% completed, the ‘endStake’ function can be executed. Upon execution, the C-Shares are lost forever and the initial $ESCROW tokens plus the earned yield are minted and paid to the staker.
                  </p>
                  <p className='mb-8'>
                    Additionally, a potential new C-Share price is calculated. The guiding principle is that the initial tokens plus the earned yield should at most receive, if staked again, the same amount of C-Shares as the previous stake. To ensure this, a global C-Share price is updated when specific conditions are met (explained in the following section). Initially, the price starts at 10,000 tokens per C-Share, and this value can only increase over time.
                  </p>

                  <p className='mb-8'>
                    The formula for calculating the potential new C-Share price is as follows:
                  </p>
                  <p className='mb-8 justify-self-center italic'>
                    {'(1,500,000,000 + the lower value between “total tokens paid at stake completion” and 150,000,000) × (total tokens paid at stake completion) ÷ ((1820 × number of C-Shares in the stake) ÷ (1820 + the lower value between “3640” and (days staked – 1)) × 1,500,000,000)'}
                  </p>
                  <p className='mb-8'>
                    If the result of this calculation is greater than the current C-Share price, the price is updated and replaced by the new value for all stakers. If the result is lower than the global C-Share price, then no replacement occurs.
                  </p>
                </div>

                <h4 className="text-lg font-semibold mb-5 text-text-secondary">Late End Stake</h4>
                <div className="space-y-4 text-text-secondary">
                  <p className='mb-8'>
                    If the 'end stake' function is not executed within the first 14 days after the staking period ends, starting on day 15, 0.125% of the initial tokens plus earned yield is calculated and deducted daily as a late end stake penalty, until the 'end stake' function is executed or the tokens are fully depleted (after 800 days).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className=" rounded-lg p-6">
            <h2
              className="text-2xl font-bold mb-12 cursor-pointer hover:text-primary transition-colors duration-200"
              onClick={() => toggleSection(5)}
            >
              5- Presale
            </h2>

            <div className="space-y-6 text-text-secondary px-4">
              <p className='mb-8'>
                The $ESCROW presale will be deployed on the Ethereum network. As previously mentioned, it will be a limited presale, with only 5% of the tokens available before launch. This is to mitigate sell pressure during the $ESCROW launch. As a result, investors who miss the presale will have to buy on the open market after launch, driving the price of $ESCROW up.
              </p>

              <div>
                <h3 id='section-5-1' className="text-xl font-semibold my-16 text-text-secondary">
                  5.1 Presale date, process, duration, and rounds
                </h3>
                <p className='mb-8'>
                  The presale is going to take place on November 11 2025, and will last until 5% of the max supply tokens are fully sold, or for a duration of 34 days, whichever happens first.
                </p>
                <p className='mb-8'>
                  The $ESCROW presale is available worldwide, except for the following countries: Afghanistan, Belarus, Burkina Faso, Cambodia, Cuba, Haiti, Iran, Mozambique, Myanmar, Nigeria, North Korea, Pakistan, Russia, Sudan, South Sudan, Syria, Venezuela, Yemen, Zimbabwe.
                </p>
                <p className='mb-8'>
                  The participation process in the presale is equal for every country except for the United States of America:
                </p>
                <p className='mb-8'>
                  Investors from all eligible countries are subject to KYC/AML approval provided by a third-party company, Sumsub. United States participants, in addition to the KYC/AML process, must go through an extra step to be approved, as they have to be U.S. accredited investors. This additional step consists of submitting a document proving their accredited investor status, such as Form 1099, Form 1040, IRS Form W-2, or K-1 for the two most recent years.
                </p>
                <br />
                <p className='mb-8'>
                  There will be 2 presale rounds:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Round 1 will last a maximum of 23 days.</li>
                  <li>Round 2 will last a maximum of 11 days.</li>
                </ul>
              </div>

              <div>
                <h3 id='section-5-2' className="text-xl font-semibold my-16 text-text-secondary">
                  5.2 Accepted cryptocurrencies for the $ESCROW limited presale
                </h3>
                <p className='mb-8'>
                  The $ESCROW limited presale will accept 7 cryptocurrencies:
                </p>
                <br />
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Ethereum (ETH)</li>
                  <li>USDT</li>
                  <li>USDC</li>
                  <li>LINK</li>
                  <li>WBNB</li>
                  <li>WETH</li>
                  <li>WBTC</li>
                </ul>
              </div>

              <div>
                <h3 id='section-5-3' className="text-xl font-semibold my-16 text-text-secondary">
                  5.3 Presale Token Distribution and $ESCROW Launch
                </h3>
                <img src={Launch_and_Distribution} alt="Launch and distribution" className="rounded-lg my-20 object-contain justify-self-center" />
                <p className='mb-8'>
                  Once the presale is finished, a Claim function will become available for all participants in the presale section of the $ESCROW website (iescrow.io/presale). Upon execution, investors will receive their $ESCROW tokens at the same address used to participate in the presale. These tokens will then be ready to stake, hold, sell, or transfer, as well as to access future benefits following the iEscrow Exchange launch, such as using $ESCROW to reduce operational fees, or any other utilities that may arise from using $ESCROW within the exchange, including promotions and airdrops.
                </p>
                <p className='mb-8'>
                  As soon as the presale ends, $ESCROW will be listed on Uniswap. The LP tokens will be locked for 4 years, as previously stated in this document. If Uniswap remains in the project’s best interest after that period, the LP tokens will be permanently burned. Otherwise, the liquidity may be migrated to another DEX and locked again for an additional 4 years, with the option to burn them after that time if the new DEX continues to operate in alignment with the best interests of $ESCROW holders.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className=" rounded-lg p-6">
            <h2
              className="text-2xl font-bold mb-12 cursor-pointer hover:text-primary transition-colors duration-200"
              onClick={() => toggleSection(6)}
            >
              6- Roadmap
            </h2>
            <div className="text-text-secondary px-4">
              <img src={Roadmap} alt="Roadmap" className="rounded-lg my-16 object-contain justify-self-center" />
              <p className='mb-8'>
                Upon developing a launch strategy for $ESCROW, we concluded that implementing milestones was the best approach rather than launching the entire $ESCROW ecosystem all at once. Having a roadmap creates a positive price event for the $ESCROW token when the iEscrow exchange is launched, which benefits early investors. The iEscrow hybrid CEX/DEX P2P exchange unlocks $ESCROW's full value, tokenomics and capabilities, giving this phased approach a significant advantage over launching everything on day 1.
              </p>
              <p className='mb-8'>
                The $ESCROW token can be massively benefited from launching a hybrid CEX/DEX P2P escrow exchange further down the line, taking advantage of the publicity and the overall marketing strategy. This way $ESCROW investors have a tangible, real reason to hold beyond market speculation and the dynamics of economic cycles, helping preserve the token's long-term value and attract new investors along the way. To fully capture the upside potential of the cryptocurrency ecosystem, it’s crucial not to rely solely on speculation or pre-existing demand, but to keep building, solving real-world problems, and continuously creating new demand by expanding the $ESCROW ecosystem’s utility and value.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className=" rounded-lg p-6">
            <h2
              className="text-2xl font-bold mb-12 cursor-pointer hover:text-primary transition-colors duration-200"
              onClick={() => toggleSection(7)}
            >
              7- Conclusion
            </h2>
            <div className="space-y-4 text-text-secondary px-4">
              <p className='mb-8'>
                The experienced cryptocurrency investor understands this ecosystem is full of noise and that we need to separate the valuable projects from the non-valuable ones in order to seize the opportunities that are still available in this space. This means not only reviewing the underlying technology, tokenomics, and the logic of different protocols, but also assessing each project’s long-term value proposition. It involves analyzing what real-world problems a project solves within the cryptocurrency ecosystem, the team behind it, their goals and direction, and all the other variables involved. We believe the ultimate goal is to make crypto the perfect form of money. That requires greater security, more decentralization, better UI/UX for non-tech-savvy users, enhanced interoperability, and ultimately convincing even the most conservative investors that crypto is not only better than FIAT, but it's also a great investment opportunity, and the indisputable future of money.
              </p>

              <p className='mb-8'>
                Every investor has the opportunity to help change the world by investing in the right projects. A great parallel to simply explain this fact is how social media algorithms work. They amplify posts with higher engagement, more likes, more comments, more interaction. What social media algorithms are doing is imitating an aspect of life, because whatever we place our attention and energy on, it amplifies.And since money is a form of energy, when enough investors allocate capital into a valuable project, it gets bigger, it gets more eyeballs and can help more people. $ESCROW was developed with this very principle in mind. Our ecosystem was built around a vision of a strong community that, together with the iEscrow team, is committed to spreading awareness with the clear understanding that they’re part of a project helping cryptocurrency become the perfect money. That’s also why we’ve conducted 2 security audits with Certik and we have a third one on its way, to achieve that standard and ensure our users transact within a secure, clean and robust protocol.
              </p>
              <p className='mb-8'>
                We've created something of real value, that solves a real world problem by enhancing transaction security when using cryptocurrency to pay for goods and services. We welcome you to be part of this journey through space, and hopefully we can travel together towards the moon.
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
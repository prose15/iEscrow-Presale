import GasLogo from "../../assets/img/gas-fee.svg"

const GasFee = () => {
  return (
    <div className="w-full flex items-center jutsify-start flex-nowrap text-bg-logo">
      <img className="size-4 md:size-5 text-bg-logo" src={GasLogo} alt={'Gas pump'} />
      <span>&nbsp; -</span>
    </div>
  );
}
 
export default GasFee;
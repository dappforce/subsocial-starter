import { useContext } from "react";
import { SubsocialContext } from "../subsocial/provider";
import { SpaceData } from "@subsocial/api/types";
import Tag from './Tag';
import "../App.css";

const SpaceTile = ({ space }: { space: SpaceData | undefined }) => {
  const { network } = useContext(SubsocialContext);

  if (!space || !space.content) return <></>

  return <div className="spaceTileContainer">
    <div className="spaceTile">
      <div className="logo">
        {space.content.image ? <img src={network.ipfsNodeUrl + '/ipfs/' + space.content?.image} /> : <></>}
      </div>
      <div className="content">
        <h1>{space.content?.name}</h1>
        <p>{space.content?.summary}</p>
        <div className="tags">{space.content?.tags.map((i) => <Tag key={i} title={i.toString()} />)}</div>
      </div>
    </div>
  </div>
}

export default SpaceTile;

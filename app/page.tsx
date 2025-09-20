"use client"; // ⚠️ aggiungi questa riga in cima

import Loader3D from "./component/Loader3D";
import ModelScene2 from "./component/ModelScene2";
import SideModel from "./component/SideModel";
import RightModel from "./component/RightModel";
import FixedModel from "./component/FixedModel";
import Header from "./component/Header";
import { useState } from "react";
import RotatingScene from "./component/RotatingScene";
import Footer from "./component/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="">
      {loading && <Loader3D onFinish={() => setLoading(false)} />}
      {!loading && (
        <>
          <Header />
          <ModelScene2 />
          <SideModel />
          <RightModel />
          <FixedModel />
          <Footer />
        </>
      )}
    </div>
  );
}

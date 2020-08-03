import { NextPage } from "next";
import Link from "next/link";
import { Rooms } from "../components/index/Rooms";
import { useRef, useCallback } from "react";
import { Refreshable } from "../components/Refreshable";

const page: NextPage = () => {
  const ref = useRef<Refreshable>();

  const handleRefresh = useCallback(
    () => ref.current && ref.current.refresh(),
    [ref.current]
  );

  return (
    <section>
      <p>
        hello world! to create a new room, visit{" "}
        <Link href="/new">
          <a>this link</a>
        </Link>
        .
      </p>
      <p>existing rooms are listed below:</p>
      <Rooms ref={ref} />
      <button disabled={!!ref.current} onClick={handleRefresh}>
        refresh
      </button>
    </section>
  );
};

export default page;

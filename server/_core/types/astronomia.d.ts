// Minimal ambient types for astronomia — the upstream package has no types.
// We only declare the members we actually touch in server/astro-engine.ts.

declare module "astronomia" {
  export namespace julian {
    function DateToJD(date: Date): number;
  }

  export namespace solar {
    function apparentLongitude(T: number): number; // radians
  }

  export namespace moonposition {
    interface MoonPos {
      lon: number; // radians
      lat: number; // radians
      range: number;
    }
    function position(jd: number): MoonPos;
  }

  export namespace planetposition {
    interface HelioPos {
      lon: number; // radians
      lat: number;
      range: number;
    }
    class Planet {
      constructor(data: unknown);
      position(jd: number): HelioPos;
    }
  }

  export namespace sidereal {
    function apparent(jd: number): number; // hours
    function mean(jd: number): number;
  }

  export namespace nutation {
    function meanObliquity(jd: number): number; // radians
  }

  export namespace base {
    function J2000Century(jd: number): number;
  }
}

declare module "astronomia/data/vsop87Bmercury" {
  const data: unknown;
  export default data;
}
declare module "astronomia/data/vsop87Bvenus" {
  const data: unknown;
  export default data;
}
declare module "astronomia/data/vsop87Bearth" {
  const data: unknown;
  export default data;
}
declare module "astronomia/data/vsop87Bmars" {
  const data: unknown;
  export default data;
}
declare module "astronomia/data/vsop87Bjupiter" {
  const data: unknown;
  export default data;
}
declare module "astronomia/data/vsop87Bsaturn" {
  const data: unknown;
  export default data;
}
declare module "astronomia/data/vsop87Buranus" {
  const data: unknown;
  export default data;
}
declare module "astronomia/data/vsop87Bneptune" {
  const data: unknown;
  export default data;
}

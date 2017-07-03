interface BucketMap { [s: string]: number; }

export function CTMC(transMatrix: [number[]], T: number, start: any, path: boolean): any;

export function DTMC(transMatrix: [number[]], steps: any, start: any, path: boolean): any;

export function GBM(S0: number, mu: number, sigma: number, T: number, number: any, path: boolean): number[];

export function brown(mu: number, sigma: number, T: number, steps: number, path: boolean): number[];

export function exp(lambda: number): number;

export function hist(arr: number[]): BucketMap;

export function norm(mu: number, sigma: number, num: number): number[];

export function pareto(x_m: any, alpha: any): any;

export function poissP(lambda: any, T: number, path: boolean): number[];

export function sample(arr: any[], n: number): any[];

export namespace CTMC {
    const prototype: {
    };

}

export namespace DTMC {
    const prototype: {
    };

}

export namespace GBM {
    const prototype: {
    };

}

export namespace brown {
    const prototype: {
    };

}

export namespace exp {
    const prototype: {
    };

}

export namespace hist {
    const prototype: {
    };

}

export namespace norm {
    const prototype: {
    };

}

export namespace pareto {
    const prototype: {
    };

}

export namespace poissP {
    const prototype: {
    };

}

export namespace sample {
    const prototype: {
    };

}


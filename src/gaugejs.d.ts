declare module 'gaugeJS' {
    export class Gauge {
        constructor(target: HTMLElement);
        setOptions(options: any): void;
        maxValue: number;
        setMinValue(value: number): void;
        animationSpeed: number;
        set(value: number): void;
    }
}
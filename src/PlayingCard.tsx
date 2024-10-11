import { forwardRef, useEffect, useState } from "react";
import { Vec2, Var, wrap } from "./common.tsx";

interface Props {
    card: string;
    style: React.CSSProperties;
    mouseOver?: any;
    click?: any,
    mouse?: MouseEvent;
    hover?: boolean;
    react?: boolean;
    x?: number,
    y?: number,
    position?: Vec2,
}

function rotate({ x, y }: Vec2, theta: number) {
    const sin = Math.sin((theta * Math.PI) / 180);
    const cos = Math.cos((theta * Math.PI) / 180);
    return { x: x * cos - y * sin, y: x * sin + y * cos };
}

const PlayingCard = forwardRef<HTMLImageElement, Props>(
    ({ card, style, ...props }: Props, ref) => {
        // function PlayingCard({ card, style, ...props }: Props) {
        let isTarget = false;
        if (props.x !== undefined && props.y !== undefined && props.position !== undefined) {
            isTarget = (props.x == props.position.x && props.y == props.position.y);
        }
        const mouseOver = props.mouseOver || (() => {});
        const click = props.click || (() => {});
        const hover = !isTarget;
        const react = isTarget;
        const rotateX: Var<number> = wrap(useState(0));
        const rotateY: Var<number> = wrap(useState(0));
        const position: Var<Vec2> = wrap(
            useState(rotate({ x: 1, y: 0 }, Math.floor(Math.random() * 360)))
        );
        const theta = 2;
        const transform = style.transform || "";

        useEffect(() => {
            if (hover) {
                const intervalId = setInterval(() => {
                    position.set((v: Vec2) => {
                        return rotate(v, theta);
                    });
                }, 20);
                return () => clearInterval(intervalId);
            }
        }, []);

        useEffect(() => {
            if (hover) {
                rotateX.set(10 * position.get.x);
                rotateY.set(10 * position.get.y);
            }
        }, [position.get]);

        useEffect(() => {
            if (props.mouse && ref && react) {
                // const box = ref.current.getBoundingClientRect();
                rotateX.set(
                    (90 * (props.mouse.clientX - window.innerWidth / 2)) /
                        window.innerWidth
                );
                rotateY.set(
                    (90 * (props.mouse.clientY - window.innerHeight / 2)) /
                        window.innerHeight
                );
                // console.log(rotateX.get, rotateY.get);
            }
        }, [props.mouse]);

        return (
            <img
                ref={ref}
                src={card}
                onMouseOver={mouseOver}
                onClick={click}
                style={{
                    objectFit: "contain",
                    imageRendering: "pixelated",
                    minHeight: "100%",
                    ...style,
                    transform: `rotateX(${rotateX.get}deg) rotateY(${rotateY.get}deg) ${transform}`,
                }}
            ></img>
        );
        // }
    }
);

export default PlayingCard;

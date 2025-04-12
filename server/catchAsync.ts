import type { NextFunction, Request, Response } from "express";

type CallbackFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void>;
const catchAsync =
  (fn: CallbackFunction) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      err ? res.status(400).json({ error: err.message }) : next(err);
    });
  };

export default catchAsync;

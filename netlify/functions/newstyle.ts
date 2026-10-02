import {
  routeNewStyle,
  type NewStyleEvent,
} from "../../server/newstyle/router";
// Login is only exposed by the dedicated, platform-rate-limited function.
export const handler = (event: NewStyleEvent) => routeNewStyle(event);

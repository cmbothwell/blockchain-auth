import { CheckIcon } from "@heroicons/react/solid";
import { AppState, State } from "../App";

export type Steps = Array<{
  id: string;
  name: string;
  status: "complete" | "current" | "upcoming";
  description: string;
}>;

const connectSteps: Steps = [
  {
    id: "01",
    name: "Connect Wallet",
    status: "current",
    description: "Lorem Ipsum",
  },
  {
    id: "02",
    name: "Release Enc. Key",
    status: "upcoming",
    description: "Lorem Ipsum",
  },
  {
    id: "03",
    name: "Sign & Register",
    status: "upcoming",
    description: "Lorem Ipsum",
  },
  { id: "04", name: "Verify", status: "upcoming", description: "Lorem Ipsum" },
];

const releaseSteps: Steps = [
  {
    id: "01",
    name: "Connect Wallet",
    status: "complete",
    description: "Lorem Ipsum",
  },
  {
    id: "02",
    name: "Release Enc. Key",
    status: "current",
    description: "Lorem Ipsum",
  },
  {
    id: "03",
    name: "Sign & Register",
    status: "upcoming",
    description: "Lorem Ipsum",
  },
  { id: "04", name: "Verify", status: "upcoming", description: "Lorem Ipsum" },
];

const signAndRegisterSteps: Steps = [
  {
    id: "01",
    name: "Connect Wallet",
    status: "complete",
    description: "Lorem Ipsum",
  },
  {
    id: "02",
    name: "Release Enc. Key",
    status: "complete",
    description: "Lorem Ipsum",
  },
  {
    id: "03",
    name: "Sign & Register",
    status: "current",
    description: "Lorem Ipsum",
  },
  { id: "04", name: "Verify", status: "upcoming", description: "Lorem Ipsum" },
];

const verifySteps: Steps = [
  {
    id: "01",
    name: "Connect Wallet",
    status: "complete",
    description: "Lorem Ipsum",
  },
  {
    id: "02",
    name: "Release Enc. Key",
    status: "complete",
    description: "Lorem Ipsum",
  },
  {
    id: "03",
    name: "Sign & Register",
    status: "complete",
    description: "Lorem Ipsum",
  },
  { id: "04", name: "Verify", status: "current", description: "Lorem Ipsum" },
];

const completeSteps: Steps = [
  {
    id: "01",
    name: "Connect Wallet",
    status: "complete",
    description: "Lorem Ipsum",
  },
  {
    id: "02",
    name: "Release Enc. Key",
    status: "complete",
    description: "Lorem Ipsum",
  },
  {
    id: "03",
    name: "Sign & Register",
    status: "complete",
    description: "Lorem Ipsum",
  },
  { id: "04", name: "Verify", status: "complete", description: "Lorem Ipsum" },
];

const mapStateToSteps = (state: State) => {
  switch (state) {
    case State.Connect:
      return connectSteps;
    case State.ReleaseEncryption:
      return releaseSteps;
    case State.SignAndRegister:
      return signAndRegisterSteps;
    case State.Verify:
      return verifySteps;
    case State.Complete:
      return completeSteps;
  }
};

const classNames = (...classes: Array<string>) => {
  return classes.filter(Boolean).join(" ");
};

const StepComponent = ({ appState }: { appState: AppState }) => {
  const { state } = appState;
  const steps = mapStateToSteps(state);

  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={classNames(
              stepIdx !== steps.length - 1 ? "pb-10" : "",
              "relative"
            )}
          >
            {step.status === "complete" ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-green-600"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="relative flex items-start group">
                  <span className="h-9 flex items-center">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-green-600 rounded-full group-hover:bg-green-800">
                      <CheckIcon
                        className="w-5 h-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                  <span className="ml-4 min-w-0 flex flex-col">
                    <span className="mt-2 text-xs font-semibold tracking-wide uppercase">
                      {step.name}
                    </span>
                    {/* <span className="text-sm text-gray-500">
                      {step.description}
                    </span> */}
                  </span>
                </span>
              </>
            ) : step.status === "current" ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
                    aria-hidden="true"
                  />
                ) : null}
                <span
                  className="relative flex items-start group"
                  aria-current="step"
                >
                  <span className="h-9 flex items-center" aria-hidden="true">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-green-600 rounded-full">
                      <span className="h-2.5 w-2.5 bg-green-600 rounded-full" />
                    </span>
                  </span>
                  <span className="ml-4 min-w-0 flex flex-col">
                    <span className="mt-2 text-xs font-semibold tracking-wide uppercase text-green-600">
                      {step.name}
                    </span>
                    {/* <span className="text-sm text-gray-500">
                      {step.description}
                    </span> */}
                  </span>
                </span>
              </>
            ) : (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="relative flex items-start group">
                  <span className="h-9 flex items-center" aria-hidden="true">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                      <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" />
                    </span>
                  </span>
                  <span className="ml-4 min-w-0 flex flex-col">
                    <span className="mt-2 text-xs font-semibold tracking-wide uppercase text-gray-500">
                      {step.name}
                    </span>
                    {/* <span className="text-sm text-gray-500">
                      {step.description}
                    </span> */}
                  </span>
                </span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepComponent;

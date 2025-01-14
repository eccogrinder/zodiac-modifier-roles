import { Condition, Operator, ParameterType } from "zodiac-roles-sdk"
import { FunctionFragment, ParamType } from "ethers/lib/utils"
import { ReactNode } from "react"
import { RiArrowDropDownLine, RiArrowDropRightLine } from "react-icons/ri"
import { PiDotBold } from "react-icons/pi"
import classes from "./style.module.css"
import Flex from "@/ui/Flex"

interface Props {
  condition: Condition
  paramIndex?: number
  abi?: FunctionFragment | ParamType
  children?: ReactNode
  collapsed?: boolean
}

const ConditionHeader: React.FC<Props> = ({
  condition,
  paramIndex,
  abi,
  children,
  collapsed,
}) => {
  const { operator, paramType } = condition

  const paramName =
    paramIndex !== undefined ? abi?.name || `[${paramIndex}]` : "" // e.g.: array elements don't have a param name
  const paramTypeLabel =
    !abi || "inputs" in abi ? ParameterType[paramType] : abi.type
  const operatorLabel = OperatorLabels[operator] || Operator[operator]

  const isComplexType = paramType >= ParameterType.Tuple

  return (
    <Flex gap={2} alignItems="center">
      <div className={classes.bullet}>
        {isComplexType ? (
          collapsed ? (
            <RiArrowDropRightLine size={16} />
          ) : (
            <RiArrowDropDownLine size={16} />
          )
        ) : (
          <PiDotBold size={16} />
        )}
      </div>
      <div className={classes.param}>
        <Flex gap={2} alignItems="center">
          {paramName && <div>{paramName}</div>}
          <div>
            <span className={classes.paramType}>{paramTypeLabel}</span>
          </div>
        </Flex>
      </div>
      {operator !== Operator.Pass && (
        <div className={classes.operator}>{operatorLabel}</div>
      )}
      {children}
    </Flex>
  )
}

export default ConditionHeader

const OperatorLabels: Record<number, ReactNode> = {
  [Operator.Matches]: "matches",
  [Operator.ArraySome]: "has at least one element that",
  [Operator.ArrayEvery]: "only has elements that",
  [Operator.ArraySubset]:
    "for each sub condition, has at least one element that meets it",

  [Operator.EqualToAvatar]: (
    <>
      is equal to &nbsp;<code>AVATAR</code>
    </>
  ),
  [Operator.EqualTo]: "is equal to",
  [Operator.GreaterThan]: "is greater than",
  [Operator.LessThan]: "is less than",
  [Operator.SignedIntGreaterThan]: "is greater than (signed int)",
  [Operator.SignedIntLessThan]: "is less than (signed int)",

  [Operator.Bitmask]: "bytes match the bitmask",
}

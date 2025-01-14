import { ReactNode } from "react"
import cn from "classnames"
import Flex from "@/ui/Flex"
import Box from "@/ui/Box"
import ConnectWallet from "@/components/ConnectWallet"
import { LinkButton } from "@/ui/Button"
import classes from "./style.module.css"

const Layout: React.FC<{
  head?: ReactNode
  children: ReactNode
  noScroll?: true
}> = ({ head, children, noScroll }) => (
  <div className={classes.page}>
    <div className={classes.topBar}>
      <Flex gap={4} justifyContent="space-between" alignItems="center">
        <Box>
          <Flex gap={1} alignItems="center">
            <Breadcrumb href="/">
              <div className={classes.appLogo}>Zodiac Roles</div>
            </Breadcrumb>
            {head}
          </Flex>
        </Box>
        <ConnectWallet />
      </Flex>
    </div>
    <div className={cn(classes.main, noScroll && classes.noScroll)}>
      {children}
    </div>
  </div>
)

export default Layout

export const Breadcrumb: React.FC<{ href: string; children: ReactNode }> = ({
  href,
  children,
}) => (
  <LinkButton className={classes.breadcrumb} href={href}>
    {children}
  </LinkButton>
)

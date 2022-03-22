import { ReactNode } from 'react'
import { Link, useColorModeValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

const NavLink = ({ slug, children }: { slug: string; children: ReactNode }) => {
  const router = useRouter()
  const isActive = router.pathname === slug
  const hoverStyle = {
    textDecoration: 'none',
    bg: useColorModeValue('gray.200', 'gray.700')
  }
  const gray = useColorModeValue('gray.200', 'gray.700')
  return (
    <NextLink href={slug}>
      <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={hoverStyle}
        href={slug}
        bg={isActive ? gray : undefined}>
        {children}
      </Link>
    </NextLink>
  )
}

export default NavLink

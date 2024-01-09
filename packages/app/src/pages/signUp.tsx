import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FC, useCallback, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { SignUp } from '@clerk/nextjs'

import HomeLayout from 'sections/shared/Layout/HomeLayout'
import { setOpenModal } from 'state/app/reducer'
import { selectShowModal } from 'state/app/selectors'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { fetchUnmintedBoostNftForCode } from 'state/referrals/action'
import { selectIsReferralCodeValid } from 'state/referrals/selectors'
import media from 'styles/media'

type AppLayoutProps = {
	children: React.ReactNode
}

type HomePageComponent = FC & { layout?: FC<AppLayoutProps> }

const Signup: HomePageComponent = () => {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const router = useRouter()
	const routerReferralCode = (router.query.ref as string)?.toLowerCase()
	const isReferralCodeValid = useAppSelector(selectIsReferralCodeValid)

	useLayoutEffect(() => {
		if (router.isReady && routerReferralCode) {
			dispatch(fetchUnmintedBoostNftForCode(routerReferralCode))
		}
	}, [dispatch, router.isReady, routerReferralCode])

	useLayoutEffect(() => {
		if (isReferralCodeValid) {
			dispatch(setOpenModal('referrals_mint_boost_nft'))
		}
	}, [dispatch, isReferralCodeValid])

	return (
		<>
			<Head>
				<title>{t('homepage.page-title')}</title>
			</Head>
			<HomeLayout>
				<Container>
					<main className="flex items-center justify-center min-h-screen">
						<SignInContainer>
							<SignUp />
						</SignInContainer>
					</main>
				</Container>
			</HomeLayout>
		</>
	)
}

export const Container = styled.div`
	width: 100%;
	margin: 0 auto;
	padding: 100px 20px 0 20px;
	${media.lessThan('sm')`
		padding: 50px 15px 0 15px;
	`}
`

const SignInContainer = styled.div`
	width: 100%;
	max-width: 600px; /* Adjust this based on your design */
	margin: 0 auto; /* Center horizontally */
	padding-bottom: 50px;
	border-radius: 8px;
	background-color: transparent;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	display: flex;
	justify-content: center; /* Center horizontally */
	align-items: center; /* Center vertically */
`

export default Signup

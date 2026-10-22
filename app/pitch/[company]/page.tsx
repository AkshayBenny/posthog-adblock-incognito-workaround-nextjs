'use client'
import { usePostHog } from 'posthog-js/react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function PitchPage() {
	const posthog = usePostHog()
	const params = useParams()
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [password, setPassword] = useState('')

	// Track page view once authenticated
	useEffect(() => {
		if (isAuthenticated) {
			posthog?.capture('$pageview', {
				company_target: params.company,
				deck_type: 'teaser_view',
			})
		}
	}, [isAuthenticated, posthog, params.company])

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault()
		// Mock database/password check
		if (password === 'johndoe') {
			setIsAuthenticated(true)
			posthog?.identify(`company_${params.company}`)
		}
	}

	const trackDeckDownload = (deckName: string) => {
		posthog?.capture('deck_downloaded', {
			deck_name: deckName,
			company_target: params.company,
		})
	}

	if (!isAuthenticated) {
		return (
			<div className='flex flex-col items-center justify-center min-h-screen'>
				<form
					onSubmit={handleLogin}
					className='p-6 border rounded shadow-sm'>
					<h2 className='mb-4 text-xl'>Enter Access Code</h2>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className='border p-2 mr-2'
						placeholder='Password'
					/>
					<button
						type='submit'
						className='bg-blue-600 text-white p-2 rounded'>
						View Pitch
					</button>
				</form>
			</div>
		)
	}

	return (
		<div className='p-10 max-w-4xl mx-auto'>
			<h1 className='text-3xl font-bold mb-6'>
				Partnership Proposal: {params.company}
			</h1>

			<div className='mb-8 p-6 bg-gray-50 border rounded-lg'>
				<h2 className='text-2xl mb-4'>Phase 1: The Teaser</h2>
				<p className='mb-4'>
					Review the introductory metrics and social impact vision.
				</p>
				<a
					href='/Kewordal_Sponsor_Teaser_Barclays.pptx'
					download='Kewordal_Sponsor_Teaser_Barclays.pptx'
					onClick={() =>
						trackDeckDownload(
							'Kewordal_Sponsor_Teaser_Barclays.pptx',
						)
					}
					className='bg-green-600 text-white px-4 py-2 rounded inline-block'>
					Download Teaser Deck
				</a>
			</div>

			<div className='p-6 bg-gray-50 border rounded-lg'>
				<h2 className='text-2xl mb-4'>Phase 2: The Full Pitch</h2>
				<p className='mb-4'>
					Unlock the comprehensive breakdown and pioneer sponsorship
					packages.
				</p>
				<a
					href='/Kewordal_Companies_Deck_Barclays - Send.pptx'
					download='Kewordal_Companies_Deck_Barclays - Send.pptx'
					onClick={() =>
						trackDeckDownload(
							'Kewordal_Companies_Deck_Barclays - Send.pptx',
						)
					}
					className='bg-blue-600 text-white px-4 py-2 rounded inline-block'>
					Download Full Pitch Deck
				</a>
			</div>
		</div>
	)
}

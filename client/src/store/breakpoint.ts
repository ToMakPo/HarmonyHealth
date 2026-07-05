import { create } from 'zustand'

interface BreakpointState {
	currentBreakpoint: Breakpoint
	updateBreakpoint: () => void
}

export const Breakpoint = { desktop: 1024, tablet: 768, mobile: 0 } as const satisfies Record<string, number>
export type Breakpoint = keyof typeof Breakpoint

function getCurrentBreakpoint(): Breakpoint {
	const screenWidth = window.innerWidth
	const breakpoints = Object.entries(Breakpoint).sort(([, a], [, b]) => b - a)
	const entry = breakpoints.find(([, width]) => screenWidth >= width)
	if (!entry) throw new Error('Unable to determine current breakpoint')
	return entry[0] as Breakpoint
}

const useBreakpoint = create<BreakpointState>(set => ({
	currentBreakpoint: getCurrentBreakpoint(),
	updateBreakpoint: () => set({ currentBreakpoint: getCurrentBreakpoint() })
}))

// Listen for window resize events and update the breakpoint in the store
if (typeof window !== 'undefined') {
	window.addEventListener('resize', () => {
		useBreakpoint.getState().updateBreakpoint()
	})
}

export default useBreakpoint

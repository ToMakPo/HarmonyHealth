import { companyInfo } from '../../store/info'
import './privacy-policy.styles.scss'

function PrivacyPolicyPage() {
	return (
		<div id='privacy-policy-page'>
			<div id='privacy-policy-content'>
				<h1>Privacy Policy</h1>
				<p>
					This Privacy Policy describes how Harmony Health Wellness Center ("we," "us," or "our") collects, uses, and shares
					information from individuals who visit our website, use our services, or otherwise interact with us ("Consumers"). We are
					committed to protecting your privacy and safeguarding your Personally Identifiable Information (PII). Please read this
					Privacy Policy carefully to understand how your information is handled. By accessing or using our website or services, you
					consent to the practices described in this Privacy Policy.
				</p>

				<section id='information-we-collect'>
					<h2>1. Information We Collect</h2>
					<p>We may collect the following types of information:</p>

					<h3>Personal Information:</h3>
					<p>
						When you visit our website or use our services, we may collect personal information you voluntarily provide. This may
						include your name, email address, phone number, and any other details you choose to share.
					</p>
					<p>
						We may use your Personal Data to contact you with newsletters, marketing, and/or promotional materials that may be of
						interest to you. By providing your phone number, you agree to receive text messages from us. Message and data rates may
						apply. Message frequency may vary. Reply <strong>HELP</strong> for assistance or <strong>STOP</strong> or{' '}
						<strong>UNSUBSCRIBE</strong> to opt out.
					</p>

					<h3>Automatically Collected Information:</h3>
					<p>
						We may collect certain information automatically when you interact with our website, such as your IP address, browser
						type, device type, and pages visited.
					</p>

					<h3>Cookies:</h3>
					<p>
						We may use cookies and similar technologies to better understand your browsing behavior. Please refer to our Cookie
						Policy for additional details.
					</p>
				</section>

				<section id='how-we-use-your-information'>
					<h2>2. How We Use Your Information</h2>
					<p>We use the information collected for the following purposes:</p>

					<h3>Providing Services:</h3>
					<p>To deliver our wellness services and respond to your inquiries.</p>

					<h3>Communication:</h3>
					<p>
						To send important updates, appointment reminders, and promotional materials. You may opt out of promotional
						communications at any time.
					</p>

					<h3>Website Improvement:</h3>
					<p>To analyze usage and improve website performance, content, and user experience.</p>
				</section>

				<section id='sharing-your-information'>
					<h2>3. Sharing Your Information</h2>
					<p>
						We do not sell or share your Personally Identifiable Information with third parties for marketing purposes. No mobile
						information will be shared with third parties or affiliates for marketing or promotional purposes.
					</p>
					<p>We may share your information in the following situations:</p>

					<h3>Business Operations:</h3>
					<p>
						With trusted third-party service providers who assist with essential functions such as payment processing, customer
						support, and website maintenance.
					</p>

					<h3>Legal Requirements:</h3>
					<p>When required by law or to comply with legal processes.</p>

					<h3>Business Transfers:</h3>
					<p>
						In the event of a merger, sale, or acquisition, your information may be transferred, but will remain protected under
						this Privacy Policy.
					</p>
				</section>

				<section id='your-choices-and-rights'>
					<h2>4. Your Choices and Rights</h2>
					<p>You have the following rights regarding your personal information:</p>
					<ul>
						<li>
							<strong>Access:</strong> Request access to the personal data we hold about you
						</li>
						<li>
							<strong>Correction:</strong> Request updates or corrections to inaccurate information
						</li>
						<li>
							<strong>Deletion:</strong> Request deletion of your data, subject to legal obligations
						</li>
						<li>
							<strong>Data Portability:</strong> Request a copy of your data in a structured format
						</li>
					</ul>
				</section>

				<section id='changes-to-this-privacy-policy'>
					<h2>5. Changes to This Privacy Policy</h2>
					<p>
						We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Updates will
						be posted on this page with a revised “Last Updated” date. We encourage you to review this policy regularly.
					</p>
				</section>

				<section id='contact-us'>
					<h2>6. Contact Us</h2>
					<p>If you have any questions or concerns regarding this Privacy Policy or our data practices, please contact us:</p>
					<address>
						<div>{companyInfo.name}</div>
						<div>
							{companyInfo.address.map((line, index) => (
								<div key={index}>{line}</div>
							))}
						</div>
						<div>
							Phone: <a href={`tel:1${companyInfo.phone.replace(/[^0-9]/g, '')}`}>{companyInfo.phone}</a>
						</div>
						<div>
							Email: <a href={`mailto:${companyInfo.email}?subject=Question%20about%20Privacy%20Policy`}>{companyInfo.email}</a>
						</div>
					</address>
				</section>

				<footer className='privacy-policy-footer'>
					<p>&copy; {new Date().getFullYear()} Harmony Health Wellness Center. All rights reserved.</p>
					<p>last updated: {new Date('2026-07-26').toLocaleDateString()}</p>
				</footer>
			</div>
		</div>
	)
}

export default PrivacyPolicyPage

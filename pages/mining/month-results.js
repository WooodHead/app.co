import React from 'react'
import { connect } from 'react-redux'
import { Flex, Box, Type } from 'blockstack-ui'
import { Page } from '@components/page'
import Head from '@containers/head'
import { bindActionCreators } from 'redux'
import { Section, Content } from '@components/mining-admin/month'
import { Table, Th, SpacedTd, Td, Thead, SubReward, ClickableTr } from '@components/mining-admin/table'
import { AppLink, Name, Description, Container, Rank, Rewards } from '@components/mining/registered-apps/styled'
import { AppIcon } from '@components/app-icon'
import { ButtonLink } from '@components/mining-admin/collapsable'
import Reviewer from '@components/mining/reviewer'
import Modal from '@containers/modals/app'

import AppStore from '@stores/apps'

class MonthResults extends React.Component {
  static getInitialProps(context) {
    const { month, year } = context.query

    return {
      month,
      year
    }
  }

  title() {
    return `App Mining rewards for ${this.props.report && this.props.report.humanReadableDate}`
  }

  handleAppClick(event, app) {
    const altKey = event.metaKey || event.altKey || event.ctrlKey
    if (altKey) {
      return window.open(`/app/${app.slug}`)
    }
    return this.props.doSelectApp(app.id)
  }

  rankings() {
    const { report } = this.props

    return report.compositeRankings.map((app, index) => (
      <ClickableTr>
        <SpacedTd display={['none', 'table-cell']}
          style={{ cursor: 'pointer' }} onClick={(evt) => this.handleAppClick(evt, app)}
        >
          {index + 1}
        </SpacedTd>
        <Td style={{ cursor: 'pointer' }} onClick={(evt) => this.handleAppClick(evt, app)}>
          <AppLink style={{borderTop: 'none'}}>
            <AppIcon src={app.imgixImageUrl} size={48} alt={app.name} />
            <Container>
              <Name>
                <Rank>{index + 1}{'. '}</Rank>
                {app.name}
              </Name>
              <Description>
                <Type.span fontSize="1em" display="block">{app.description}</Type.span>
                <Rewards>
                  <Type.strong fontSize="1em">Monthy rewards:</Type.strong>
                  {' '}{app.formattedUsdRewards} ({app.payout.BTCPaymentValue / 10e7} BTC)
                </Rewards>
              </Description>
            </Container>
          </AppLink>
        </Td>
        <SpacedTd 
          style={{ cursor: 'pointer' }} 
          onClick={(evt) => this.handleAppClick(evt, app)}
          display={['none', 'table-cell']}>
          {app.payout && (
            <>
              {app.formattedUsdRewards}
              <SubReward>
                ({app.payout.BTCPaymentValue / 10e7} BTC)
              </SubReward>
            </>
          )}
        </SpacedTd>
      </ClickableTr>
    ))
  }

  reviewers() {
    const { report } = this.props
    return report.MiningReviewerReports.map((reviewer, index) => (
      <Reviewer reviewer={reviewer} index={index} />
    ))
  }

  render() {
    const { report } = this.props
    return (
      <Page wrap={false}>
        <Head title={this.title()} />
        <Flex width={1} px={[1, 3]} mb={5} flexDirection={['column', 'column', 'column', 'row']} justifyContent="space-between" flexWrap="wrap">
          <Box width={[ 1, 1, 1, 2/3 ]}>
            <Section>
              <h2>
                {this.title()}
                {report.name && ` (${report.name})`}
              </h2>
            </Section>
            <Table>
              <Thead>
                <tr>
                  <Th display={['none', 'table-cell']}>Rank</Th>
                  <Th display={['none', 'table-cell']}>App</Th>
                  <Th display={['none', 'table-cell']}>Monthly Rewards</Th>
                </tr>
              </Thead>
              <tbody>
                {this.rankings()}
              </tbody>
            </Table>
          </Box>
          <Box width={[1, 1, 1, 1/3]} pl={[0, 0, 0, 3]} pt={[3, 3, 3, 0]}>
            <Section>
              <Content>
                <Type.p>
                  <Type.strong fontWeight="700">{report.compositeRankings.length} Blockstack apps</Type.strong>{' '}
                  earned
                  {' '}<Type.strong fontWeight="700">{report.formattedTotalRewardsUsd}</Type.strong>{' '}
                  in App Mining rewards for the month of {report.humanReadableDate}.
                </Type.p>
                <Type.p>
                  These decentralized apps have guaranteed users control over their identity by implementing
                  {' '}<a href="https://blockstack.org">Blockstack authentication</a>.
                </Type.p>
                <Type.p mb={4}>
                  Are you a Blockstack app developer? Start earning rewards as soon as next month:
                </Type.p>
                <ButtonLink href="/mining" style={{width: '100%', margin: 0}}>Learn about App Mining</ButtonLink>
                <Type.p mt={4} color="#1421446e" fontSize="0.9em">
                  Note: USD values displayed for payouts made in BTC were determined based on the exchange rate at the time of conversion on {report.friendlyPurchasedAt}.
                </Type.p>
                {this.reviewers()}
              </Content>
            </Section>
          </Box>
        </Flex>
        <Modal doGoBack={false}/>
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let foundReport
  const { month, year } = ownProps
  state.mining.appMiningMonths.forEach((report) => {
    const sameMonth = report.monthName.toLowerCase() === month.toLowerCase()
    if (sameMonth && (report.year === parseInt(year, 10))) {
      foundReport = report
    }
  })
  return {
    report: foundReport
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AppStore.actions), dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthResults)
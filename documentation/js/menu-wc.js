'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Mahindra_Finance documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdminAttendanceApprovalModule.html" data-type="entity-link">AdminAttendanceApprovalModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminAttendanceApprovalModule-dc535dc21cd6e99d8ec77ad1eb27358d"' : 'data-target="#xs-components-links-module-AdminAttendanceApprovalModule-dc535dc21cd6e99d8ec77ad1eb27358d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminAttendanceApprovalModule-dc535dc21cd6e99d8ec77ad1eb27358d"' :
                                            'id="xs-components-links-module-AdminAttendanceApprovalModule-dc535dc21cd6e99d8ec77ad1eb27358d"' }>
                                            <li class="link">
                                                <a href="components/AdminAttendanceApprovalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminAttendanceApprovalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminDeclarationConfigModule.html" data-type="entity-link">AdminDeclarationConfigModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminDeclarationConfigModule-f80bbf5aa6e9518b46e28c79253e4909"' : 'data-target="#xs-components-links-module-AdminDeclarationConfigModule-f80bbf5aa6e9518b46e28c79253e4909"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminDeclarationConfigModule-f80bbf5aa6e9518b46e28c79253e4909"' :
                                            'id="xs-components-links-module-AdminDeclarationConfigModule-f80bbf5aa6e9518b46e28c79253e4909"' }>
                                            <li class="link">
                                                <a href="components/AdminDeclarationConfigComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminDeclarationConfigComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminEmployeeDeclarationModule.html" data-type="entity-link">AdminEmployeeDeclarationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminEmployeeDeclarationModule-cf6b9d37af08a01850c6df9d497082e3"' : 'data-target="#xs-components-links-module-AdminEmployeeDeclarationModule-cf6b9d37af08a01850c6df9d497082e3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminEmployeeDeclarationModule-cf6b9d37af08a01850c6df9d497082e3"' :
                                            'id="xs-components-links-module-AdminEmployeeDeclarationModule-cf6b9d37af08a01850c6df9d497082e3"' }>
                                            <li class="link">
                                                <a href="components/AdminEmployeeDeclarationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminEmployeeDeclarationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminEmployeeFlexiConfigExcludeModule.html" data-type="entity-link">AdminEmployeeFlexiConfigExcludeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminEmployeeFlexiConfigExcludeModule-0709ebc7b1c3184055ed8aef70e412a3"' : 'data-target="#xs-components-links-module-AdminEmployeeFlexiConfigExcludeModule-0709ebc7b1c3184055ed8aef70e412a3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminEmployeeFlexiConfigExcludeModule-0709ebc7b1c3184055ed8aef70e412a3"' :
                                            'id="xs-components-links-module-AdminEmployeeFlexiConfigExcludeModule-0709ebc7b1c3184055ed8aef70e412a3"' }>
                                            <li class="link">
                                                <a href="components/AdminEmployeeFlexiConfigExcludeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminEmployeeFlexiConfigExcludeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminEmployeeFlexiConfigModule.html" data-type="entity-link">AdminEmployeeFlexiConfigModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminEmployeeFlexiConfigModule-d2cf15ed4d45c63f3c152064bd55030f"' : 'data-target="#xs-components-links-module-AdminEmployeeFlexiConfigModule-d2cf15ed4d45c63f3c152064bd55030f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminEmployeeFlexiConfigModule-d2cf15ed4d45c63f3c152064bd55030f"' :
                                            'id="xs-components-links-module-AdminEmployeeFlexiConfigModule-d2cf15ed4d45c63f3c152064bd55030f"' }>
                                            <li class="link">
                                                <a href="components/AdminEmployeeFlexiConfigComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminEmployeeFlexiConfigComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminEmployeeFlexiDeclarationModule.html" data-type="entity-link">AdminEmployeeFlexiDeclarationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminEmployeeFlexiDeclarationModule-396c8aed04be2b26735a5c547f5ad78c"' : 'data-target="#xs-components-links-module-AdminEmployeeFlexiDeclarationModule-396c8aed04be2b26735a5c547f5ad78c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminEmployeeFlexiDeclarationModule-396c8aed04be2b26735a5c547f5ad78c"' :
                                            'id="xs-components-links-module-AdminEmployeeFlexiDeclarationModule-396c8aed04be2b26735a5c547f5ad78c"' }>
                                            <li class="link">
                                                <a href="components/AdminEmployeeFlexiDeclarationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminEmployeeFlexiDeclarationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminFlexiConfigModule.html" data-type="entity-link">AdminFlexiConfigModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminFlexiConfigModule-1c8bcd641c4021169f9df91b066835ca"' : 'data-target="#xs-components-links-module-AdminFlexiConfigModule-1c8bcd641c4021169f9df91b066835ca"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminFlexiConfigModule-1c8bcd641c4021169f9df91b066835ca"' :
                                            'id="xs-components-links-module-AdminFlexiConfigModule-1c8bcd641c4021169f9df91b066835ca"' }>
                                            <li class="link">
                                                <a href="components/AdminFlexiConfigComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminFlexiConfigComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminFlexiModule.html" data-type="entity-link">AdminFlexiModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminFlexiModule-0170fa0bafd8a29c8d39667727508b80"' : 'data-target="#xs-components-links-module-AdminFlexiModule-0170fa0bafd8a29c8d39667727508b80"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminFlexiModule-0170fa0bafd8a29c8d39667727508b80"' :
                                            'id="xs-components-links-module-AdminFlexiModule-0170fa0bafd8a29c8d39667727508b80"' }>
                                            <li class="link">
                                                <a href="components/AdminFlexiComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminFlexiComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminIncomeTaxModule.html" data-type="entity-link">AdminIncomeTaxModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminIncomeTaxModule-ba13b4106446c67e2e7029899ab19860"' : 'data-target="#xs-components-links-module-AdminIncomeTaxModule-ba13b4106446c67e2e7029899ab19860"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminIncomeTaxModule-ba13b4106446c67e2e7029899ab19860"' :
                                            'id="xs-components-links-module-AdminIncomeTaxModule-ba13b4106446c67e2e7029899ab19860"' }>
                                            <li class="link">
                                                <a href="components/AdminIncomeTaxComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminIncomeTaxComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminListViewDetailsModule.html" data-type="entity-link">AdminListViewDetailsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminListViewDetailsModule-61af6571d0837917013ace75beadeea6"' : 'data-target="#xs-components-links-module-AdminListViewDetailsModule-61af6571d0837917013ace75beadeea6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminListViewDetailsModule-61af6571d0837917013ace75beadeea6"' :
                                            'id="xs-components-links-module-AdminListViewDetailsModule-61af6571d0837917013ace75beadeea6"' }>
                                            <li class="link">
                                                <a href="components/AdminListViewDetailsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminListViewDetailsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminListViewModule.html" data-type="entity-link">AdminListViewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminListViewModule-ad2f4d5318328330d44bfc0a202024f4"' : 'data-target="#xs-components-links-module-AdminListViewModule-ad2f4d5318328330d44bfc0a202024f4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminListViewModule-ad2f4d5318328330d44bfc0a202024f4"' :
                                            'id="xs-components-links-module-AdminListViewModule-ad2f4d5318328330d44bfc0a202024f4"' }>
                                            <li class="link">
                                                <a href="components/AdminListViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminListViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-9f10834b7d3a6a403e2855785f50c9d6"' : 'data-target="#xs-components-links-module-AppModule-9f10834b7d3a6a403e2855785f50c9d6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-9f10834b7d3a6a403e2855785f50c9d6"' :
                                            'id="xs-components-links-module-AppModule-9f10834b7d3a6a403e2855785f50c9d6"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppraisalLetterModule.html" data-type="entity-link">AppraisalLetterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppraisalLetterModule-f6257506382543f42c626e61bb387683"' : 'data-target="#xs-components-links-module-AppraisalLetterModule-f6257506382543f42c626e61bb387683"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppraisalLetterModule-f6257506382543f42c626e61bb387683"' :
                                            'id="xs-components-links-module-AppraisalLetterModule-f6257506382543f42c626e61bb387683"' }>
                                            <li class="link">
                                                <a href="components/AppraisalLetterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppraisalLetterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AttendanceAdminModule.html" data-type="entity-link">AttendanceAdminModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AttendanceAdminModule-346744c6cb690d186e6825d5878d7252"' : 'data-target="#xs-components-links-module-AttendanceAdminModule-346744c6cb690d186e6825d5878d7252"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AttendanceAdminModule-346744c6cb690d186e6825d5878d7252"' :
                                            'id="xs-components-links-module-AttendanceAdminModule-346744c6cb690d186e6825d5878d7252"' }>
                                            <li class="link">
                                                <a href="components/AttendanceAdminComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AttendanceAdminComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AttendanceAdminRoutingModule.html" data-type="entity-link">AttendanceAdminRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AttendanceDetailModule.html" data-type="entity-link">AttendanceDetailModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AttendanceDetailModule-b9531a9e48dbbe725283631b4cb80c7e"' : 'data-target="#xs-components-links-module-AttendanceDetailModule-b9531a9e48dbbe725283631b4cb80c7e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AttendanceDetailModule-b9531a9e48dbbe725283631b4cb80c7e"' :
                                            'id="xs-components-links-module-AttendanceDetailModule-b9531a9e48dbbe725283631b4cb80c7e"' }>
                                            <li class="link">
                                                <a href="components/AttendanceDetailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AttendanceDetailComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AttendanceModule.html" data-type="entity-link">AttendanceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AttendanceModule-bfc1bfd039c52fea8f7e59895212ea6b"' : 'data-target="#xs-components-links-module-AttendanceModule-bfc1bfd039c52fea8f7e59895212ea6b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AttendanceModule-bfc1bfd039c52fea8f7e59895212ea6b"' :
                                            'id="xs-components-links-module-AttendanceModule-bfc1bfd039c52fea8f7e59895212ea6b"' }>
                                            <li class="link">
                                                <a href="components/AttendanceComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AttendanceComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AttendanceModule-bfc1bfd039c52fea8f7e59895212ea6b"' : 'data-target="#xs-pipes-links-module-AttendanceModule-bfc1bfd039c52fea8f7e59895212ea6b"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AttendanceModule-bfc1bfd039c52fea8f7e59895212ea6b"' :
                                            'id="xs-pipes-links-module-AttendanceModule-bfc1bfd039c52fea8f7e59895212ea6b"' }>
                                            <li class="link">
                                                <a href="pipes/TimeDiffPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TimeDiffPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CurrentPaySlipModule.html" data-type="entity-link">CurrentPaySlipModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CurrentPaySlipModule-9e89b5a2eca4825b32fcd34f99663da4"' : 'data-target="#xs-components-links-module-CurrentPaySlipModule-9e89b5a2eca4825b32fcd34f99663da4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CurrentPaySlipModule-9e89b5a2eca4825b32fcd34f99663da4"' :
                                            'id="xs-components-links-module-CurrentPaySlipModule-9e89b5a2eca4825b32fcd34f99663da4"' }>
                                            <li class="link">
                                                <a href="components/CurrentPaySlipComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CurrentPaySlipComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardModule.html" data-type="entity-link">DashboardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DashboardModule-9dce54b447652538a11fa8f4524bac27"' : 'data-target="#xs-components-links-module-DashboardModule-9dce54b447652538a11fa8f4524bac27"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DashboardModule-9dce54b447652538a11fa8f4524bac27"' :
                                            'id="xs-components-links-module-DashboardModule-9dce54b447652538a11fa8f4524bac27"' }>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EmergencyModule.html" data-type="entity-link">EmergencyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EmergencyModule-cbee1a681bbac7110c49c92be0e7ebaa"' : 'data-target="#xs-components-links-module-EmergencyModule-cbee1a681bbac7110c49c92be0e7ebaa"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EmergencyModule-cbee1a681bbac7110c49c92be0e7ebaa"' :
                                            'id="xs-components-links-module-EmergencyModule-cbee1a681bbac7110c49c92be0e7ebaa"' }>
                                            <li class="link">
                                                <a href="components/EmergencyComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EmergencyComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FeedbackModule.html" data-type="entity-link">FeedbackModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FeedbackModule-f73cc80c9b24d542e13590d67e30784d"' : 'data-target="#xs-components-links-module-FeedbackModule-f73cc80c9b24d542e13590d67e30784d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FeedbackModule-f73cc80c9b24d542e13590d67e30784d"' :
                                            'id="xs-components-links-module-FeedbackModule-f73cc80c9b24d542e13590d67e30784d"' }>
                                            <li class="link">
                                                <a href="components/FeedbackComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FeedbackComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FlexiModule.html" data-type="entity-link">FlexiModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FlexiModule-6c87fa11726d75cbca870960369debb6"' : 'data-target="#xs-components-links-module-FlexiModule-6c87fa11726d75cbca870960369debb6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FlexiModule-6c87fa11726d75cbca870960369debb6"' :
                                            'id="xs-components-links-module-FlexiModule-6c87fa11726d75cbca870960369debb6"' }>
                                            <li class="link">
                                                <a href="components/FlexiComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FlexiComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/Form16Module.html" data-type="entity-link">Form16Module</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-Form16Module-a9145c0c2571314520b98738b61f5dee"' : 'data-target="#xs-components-links-module-Form16Module-a9145c0c2571314520b98738b61f5dee"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-Form16Module-a9145c0c2571314520b98738b61f5dee"' :
                                            'id="xs-components-links-module-Form16Module-a9145c0c2571314520b98738b61f5dee"' }>
                                            <li class="link">
                                                <a href="components/Form16Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Form16Component</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GiftAcknowledgeModule.html" data-type="entity-link">GiftAcknowledgeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GiftAcknowledgeModule-170c0aa13806df6148164b67326e21fc"' : 'data-target="#xs-components-links-module-GiftAcknowledgeModule-170c0aa13806df6148164b67326e21fc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GiftAcknowledgeModule-170c0aa13806df6148164b67326e21fc"' :
                                            'id="xs-components-links-module-GiftAcknowledgeModule-170c0aa13806df6148164b67326e21fc"' }>
                                            <li class="link">
                                                <a href="components/GiftAcknowledgeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GiftAcknowledgeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HolidayModule.html" data-type="entity-link">HolidayModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HolidayModule-c56b6f94a685352cbe44471aa11dbc05"' : 'data-target="#xs-components-links-module-HolidayModule-c56b6f94a685352cbe44471aa11dbc05"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HolidayModule-c56b6f94a685352cbe44471aa11dbc05"' :
                                            'id="xs-components-links-module-HolidayModule-c56b6f94a685352cbe44471aa11dbc05"' }>
                                            <li class="link">
                                                <a href="components/HolidayComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HolidayComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HospitalModule.html" data-type="entity-link">HospitalModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HospitalModule-9617650f930560f424d44792f22f8569"' : 'data-target="#xs-components-links-module-HospitalModule-9617650f930560f424d44792f22f8569"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HospitalModule-9617650f930560f424d44792f22f8569"' :
                                            'id="xs-components-links-module-HospitalModule-9617650f930560f424d44792f22f8569"' }>
                                            <li class="link">
                                                <a href="components/HospitalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HospitalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-HospitalModule-9617650f930560f424d44792f22f8569"' : 'data-target="#xs-pipes-links-module-HospitalModule-9617650f930560f424d44792f22f8569"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-HospitalModule-9617650f930560f424d44792f22f8569"' :
                                            'id="xs-pipes-links-module-HospitalModule-9617650f930560f424d44792f22f8569"' }>
                                            <li class="link">
                                                <a href="pipes/SearchPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/IncomeTaxModule.html" data-type="entity-link">IncomeTaxModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-IncomeTaxModule-2157d3369b36bc6b7ff00b802538c2bc"' : 'data-target="#xs-components-links-module-IncomeTaxModule-2157d3369b36bc6b7ff00b802538c2bc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-IncomeTaxModule-2157d3369b36bc6b7ff00b802538c2bc"' :
                                            'id="xs-components-links-module-IncomeTaxModule-2157d3369b36bc6b7ff00b802538c2bc"' }>
                                            <li class="link">
                                                <a href="components/IncomeTaxComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">IncomeTaxComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LayoutModule.html" data-type="entity-link">LayoutModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LayoutModule-cd37183dc2e4a8d7600357258220a291"' : 'data-target="#xs-components-links-module-LayoutModule-cd37183dc2e4a8d7600357258220a291"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LayoutModule-cd37183dc2e4a8d7600357258220a291"' :
                                            'id="xs-components-links-module-LayoutModule-cd37183dc2e4a8d7600357258220a291"' }>
                                            <li class="link">
                                                <a href="components/LayoutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidebarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SidebarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LayoutRoutingModule.html" data-type="entity-link">LayoutRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LeaveTravelAllowanceModule.html" data-type="entity-link">LeaveTravelAllowanceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LeaveTravelAllowanceModule-fed062acabd2e372602f2048c7564548"' : 'data-target="#xs-components-links-module-LeaveTravelAllowanceModule-fed062acabd2e372602f2048c7564548"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LeaveTravelAllowanceModule-fed062acabd2e372602f2048c7564548"' :
                                            'id="xs-components-links-module-LeaveTravelAllowanceModule-fed062acabd2e372602f2048c7564548"' }>
                                            <li class="link">
                                                <a href="components/LeaveTravelAllowanceComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LeaveTravelAllowanceComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginModule.html" data-type="entity-link">LoginModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LoginModule-bae699c939ce3f9532a8f141341deccd"' : 'data-target="#xs-components-links-module-LoginModule-bae699c939ce3f9532a8f141341deccd"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginModule-bae699c939ce3f9532a8f141341deccd"' :
                                            'id="xs-components-links-module-LoginModule-bae699c939ce3f9532a8f141341deccd"' }>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MyProfileModule.html" data-type="entity-link">MyProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MyProfileModule-20e4991a642e6b3bf6a14d15d08da42e"' : 'data-target="#xs-components-links-module-MyProfileModule-20e4991a642e6b3bf6a14d15d08da42e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MyProfileModule-20e4991a642e6b3bf6a14d15d08da42e"' :
                                            'id="xs-components-links-module-MyProfileModule-20e4991a642e6b3bf6a14d15d08da42e"' }>
                                            <li class="link">
                                                <a href="components/MyProfileComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyProfileComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PageNotFoundModule.html" data-type="entity-link">PageNotFoundModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PageNotFoundModule-3b7e271fdea725f5637e880a57d1fb49"' : 'data-target="#xs-components-links-module-PageNotFoundModule-3b7e271fdea725f5637e880a57d1fb49"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PageNotFoundModule-3b7e271fdea725f5637e880a57d1fb49"' :
                                            'id="xs-components-links-module-PageNotFoundModule-3b7e271fdea725f5637e880a57d1fb49"' }>
                                            <li class="link">
                                                <a href="components/PageNotFoundComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PageNotFoundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SalaryCardModule.html" data-type="entity-link">SalaryCardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SalaryCardModule-eddb0d92cd592d48fff2e30f0da14928"' : 'data-target="#xs-components-links-module-SalaryCardModule-eddb0d92cd592d48fff2e30f0da14928"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SalaryCardModule-eddb0d92cd592d48fff2e30f0da14928"' :
                                            'id="xs-components-links-module-SalaryCardModule-eddb0d92cd592d48fff2e30f0da14928"' }>
                                            <li class="link">
                                                <a href="components/SalaryCardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SalaryCardComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SalaryCardModule-eddb0d92cd592d48fff2e30f0da14928"' : 'data-target="#xs-pipes-links-module-SalaryCardModule-eddb0d92cd592d48fff2e30f0da14928"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SalaryCardModule-eddb0d92cd592d48fff2e30f0da14928"' :
                                            'id="xs-pipes-links-module-SalaryCardModule-eddb0d92cd592d48fff2e30f0da14928"' }>
                                            <li class="link">
                                                <a href="pipes/NewPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NewPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/securedLink.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">securedLink</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-c8ccb2a27a5db49d6baae556276a31c0"' : 'data-target="#xs-components-links-module-SharedModule-c8ccb2a27a5db49d6baae556276a31c0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-c8ccb2a27a5db49d6baae556276a31c0"' :
                                            'id="xs-components-links-module-SharedModule-c8ccb2a27a5db49d6baae556276a31c0"' }>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IncomeTaxSimulationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">IncomeTaxSimulationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ModalComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommonArray.html" data-type="entity-link">CommonArray</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigDetails.html" data-type="entity-link">ConfigDetails</a>
                            </li>
                            <li class="link">
                                <a href="classes/Constant.html" data-type="entity-link">Constant</a>
                            </li>
                            <li class="link">
                                <a href="classes/DropDownOptions.html" data-type="entity-link">DropDownOptions</a>
                            </li>
                            <li class="link">
                                <a href="classes/Employee.html" data-type="entity-link">Employee</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntityMaster.html" data-type="entity-link">EntityMaster</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterDetails.html" data-type="entity-link">FilterDetails</a>
                            </li>
                            <li class="link">
                                <a href="classes/FlexiDetails.html" data-type="entity-link">FlexiDetails</a>
                            </li>
                            <li class="link">
                                <a href="classes/FlexiDetailstest.html" data-type="entity-link">FlexiDetailstest</a>
                            </li>
                            <li class="link">
                                <a href="classes/FlexiDetailstest-1.html" data-type="entity-link">FlexiDetailstest</a>
                            </li>
                            <li class="link">
                                <a href="classes/FlexiDetailstest-2.html" data-type="entity-link">FlexiDetailstest</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegularizeModalData.html" data-type="entity-link">RegularizeModalData</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegularizeModalData-1.html" data-type="entity-link">RegularizeModalData</a>
                            </li>
                            <li class="link">
                                <a href="classes/SchemeInformation.html" data-type="entity-link">SchemeInformation</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommonService.html" data-type="entity-link">CommonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NgbDateCustomParserFormatter.html" data-type="entity-link">NgbDateCustomParserFormatter</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AdminGuard.html" data-type="entity-link">AdminGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/ITEnabledGuard.html" data-type="entity-link">ITEnabledGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Attributes.html" data-type="entity-link">Attributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Attributes-1.html" data-type="entity-link">Attributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Attributes-2.html" data-type="entity-link">Attributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseModifier.html" data-type="entity-link">BaseModifier</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseModifier-1.html" data-type="entity-link">BaseModifier</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseModifier-2.html" data-type="entity-link">BaseModifier</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data.html" data-type="entity-link">Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-1.html" data-type="entity-link">Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data-2.html" data-type="entity-link">Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISideMenu.html" data-type="entity-link">ISideMenu</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Menu.html" data-type="entity-link">Menu</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MenuList.html" data-type="entity-link">MenuList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Modifiers.html" data-type="entity-link">Modifiers</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Modifiers-1.html" data-type="entity-link">Modifiers</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Modifiers-2.html" data-type="entity-link">Modifiers</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Offset.html" data-type="entity-link">Offset</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Offset-1.html" data-type="entity-link">Offset</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Offset-2.html" data-type="entity-link">Offset</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Padding.html" data-type="entity-link">Padding</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Padding-1.html" data-type="entity-link">Padding</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Padding-2.html" data-type="entity-link">Padding</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PincodeArray.html" data-type="entity-link">PincodeArray</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PopperOptions.html" data-type="entity-link">PopperOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PopperOptions-1.html" data-type="entity-link">PopperOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PopperOptions-2.html" data-type="entity-link">PopperOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReferenceObject.html" data-type="entity-link">ReferenceObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReferenceObject-1.html" data-type="entity-link">ReferenceObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReferenceObject-2.html" data-type="entity-link">ReferenceObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SideMenu.html" data-type="entity-link">SideMenu</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserCredentials.html" data-type="entity-link">UserCredentials</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
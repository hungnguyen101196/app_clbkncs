
(function () {
    angular.module('CLBKNCS')
        .controller('InfoClubController', InfoClubController);
        InfoClubController.$inject = ['$scope', 'InfoClubService', 'ValidatorInfoClub', 'PaginationFactory', 'logger', 'limitData', 'SharedService', 'UploadService'];

    function InfoClubController($scope, InfoClubService, ValidatorInfoClub, PaginationFactory, logger, limitData, SharedService, UploadService) {
        $scope.formvalidator = ValidatorInfoClub.validationOptions();
        
        const { isEmpty, filterObject, changeCss } = SharedService;
        $scope.info = () => {
            InfoClubService.info().then((response) => {
                $scope.formInfoClub = response.Success ? (response.Data || {}) : {};
                $scope.formInfoClub = filterObject($scope.formInfoClub);
                if (!isEmpty($scope.formInfoClub.logo)) {
                    let urlLogo = $scope.formInfoClub.logo;
                    angular.element('.logo-profile').find('img').attr('src', (urlLogo || '/images/logo.jpg'))
                }
                if (!isEmpty($scope.formInfoClub.avatar)) {
                    let urlAvatar = $scope.formInfoClub.avatar;
                    angular.element('.avatar-profile').find('img').attr('src', (urlAvatar || '/images/avatar.jpg'))
                }
            })
        }

        $scope.listMemberActive = () => {
            InfoClubService.listMemberActive().then((response) => {
                $scope.members = response.Success ? (response.Data || []) : [];
            })
        }

        $scope.update = (form) => {
            const files = {};
            if (!isEmpty($scope.avatar)) {
                files.avatar = $scope.avatar;
            }
            if (!isEmpty($scope.logo)) {
                files.logo = $scope.logo;
            }
            const work_start_time = $("#start_time").find('input').val();
            const work_end_time = $("#end_time").find('input').val();
            $scope.formInfoClub.work_start_time = work_start_time;
            $scope.formInfoClub.work_end_time = work_end_time;
            if (form) {
                UploadService.uploadFiles(
                    'POST',
                    '/admin/info-clb/update',
                    files,
                    $scope.formInfoClub,
                ).then((response) => {
                    if (response.Success) {
                        logger.success('Cập nhật thành công');
                        changeCss();
                    } else {
                        logger.error(getResponseMsg(response));
                    }
                })
            } else {
                logger.error('Hãy điền đẩy đủ thông tin');
            }
        }

        function getResponseMsg(response = {}) {
            const msg = response.Message || 'Có lỗi xảy ra. Vui lòng kiểm tra lại!';
            return msg;
        };

        Promise.all([$scope.info(), $scope.listMemberActive()]).then(() => { });
    }
})();

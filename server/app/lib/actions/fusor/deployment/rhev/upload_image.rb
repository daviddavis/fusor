#
# Copyright 2015 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module Actions
  module Fusor
    module Deployment
      module Rhev
        class UploadImage < Actions::Fusor::FusorBaseAction
          def humanized_name
            _("Upload Image to Virtualization Environment")
          end

          def plan(deployment, image_file_name)
            super(deployment)
            plan_self(deployment_id: deployment.id,
                      image_file_name: image_file_name)
          end

          def run
            ::Fusor.log.info "================ UploadImage run method ===================="

            deployment = ::Fusor::Deployment.find(input[:deployment_id])

            # ssh to engine node and upload the image in the home directory
            # engine-image-uploader -N cfme-rhevm-5.3-47 -e export -v -m upload ./cfme-rhevm-5.3-47.x86_64.rhevm.ova
            #
            # -N new image name
            # -e export domain TODO: where do we get the export domain
            # -v verbose
            # -m do not remove network interfaces from image

            ssh_host = deployment.rhev_engine_host.facts['ipaddress']
            ssh_username = "root"

            username = "admin@internal"
            imported_template_name = "#{deployment.name}-cfme-template"
            export_domain_name = deployment.rhev_export_domain_name
            cfme_image_file = "/root/#{input[:image_file_name]}" # can't use find_image_file without doing filename magic :(

            # NOTE: the image file found locally is DIFFERENT than the one on
            # the rhev engine host. Also note this uses /usr/bin/ because it is on
            # rhev engine NOT locally. Do not change this to @script_dir.
            cmd = "/usr/bin/engine-image-uploader "\
                "-u #{username} "\
                "-p \'#{deployment.rhev_engine_admin_password}\' "\
                "-N #{imported_template_name} "\
                "-e #{export_domain_name} "\
                "-v -m upload #{cfme_image_file}"

            # RHEV-host username password
            client = Utils::Fusor::SSHConnection.new(ssh_host, ssh_username, deployment.rhev_root_password)
            client.on_complete(lambda { upload_image_completed })
            client.on_failure(lambda { upload_image_failed })
            client.execute(cmd)

            output[:template_name] = imported_template_name
            ::Fusor.log.info "================ Leaving UploadImage run method ===================="
          end

          def upload_image_completed
            ::Fusor.log.info "image uploaded"
          end

          def upload_image_failed
            fail _("Unable to upload image")
          end
        end
      end
    end
  end
end
